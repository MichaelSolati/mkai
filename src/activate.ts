import path from "node:path";
import { resolveItemDestination, resolveTarget } from "./config.js";
import { detectConflicts } from "./conflict.js";
import { addActivation, readState } from "./state.js";
import { stashOriginal, restoreSkillConfig } from "./stash.js";
import { createSymlink, removeSymlink } from "./symlink.js";
import type { Activation, Conflict, LinkRecord, Profile, Target } from "./types.js";

export interface ActivateOptions {
  force?: boolean;
  dryRun?: boolean;
  onConflict?: (conflict: Conflict) => Promise<boolean>;
}

export interface ActivateResult {
  success: boolean;
  linksCreated: number;
  skipped: number;
  overridden: number;
  errors: string[];
}

export async function activateProfile(
  profile: Profile,
  target: Target,
  options: ActivateOptions = {},
): Promise<ActivateResult> {
  const targetDir = resolveTarget(
    target.kind,
    target.kind === "project" ? target.projectPath : undefined,
  );

  const state = await readState();
  if (state.activations.some((a) =>
    a.profile === profile.name &&
    a.target === target.kind &&
    (target.kind === "global" || a.projectPath === target.projectPath)
  )) {
    return { success: false, linksCreated: 0, skipped: 0, overridden: 0, errors: [`Profile "${profile.name}" is already active`] };
  }

  const conflicts = await detectConflicts(profile, targetDir);
  const result: ActivateResult = { success: true, linksCreated: 0, skipped: 0, overridden: 0, errors: [] };
  const createdLinks: LinkRecord[] = [];

  const items = resolveProfileItems(profile);

  for (const item of items) {
    const source = resolveSource(profile.path, item.type, item.name);
    const destination = resolveItemDestination(targetDir, item.type, item.name);

    const conflict = conflicts.find((c) => c.name === item.name && c.type === item.type);

    if (conflict) {
      if (conflict.kind === "symlink-same-profile") {
        result.skipped++;
        continue;
      }

      if (conflict.kind === "symlink-other-profile") {
        result.errors.push(`${item.name} is owned by active profile "${conflict.ownedByProfile}" - deactivate it first`);
        continue;
      }

      if (conflict.kind === "broken-symlink") {
        if (!options.dryRun) await removeSymlink(destination);
      } else if (conflict.kind === "real-file") {
        if (!options.force && options.onConflict) {
          const proceed = await options.onConflict(conflict);
          if (!proceed) {
            result.skipped++;
            continue;
          }
        } else if (!options.force) {
          result.skipped++;
          continue;
        }

        if (!options.dryRun) {
          const stashPath = await stashOriginal(destination, profile.name, item.type, item.name);
          createdLinks.push({ type: item.type, name: item.name, source, destination, overrode: stashPath });
          await createSymlink(source, destination);
          result.overridden++;
          result.linksCreated++;
          continue;
        }
      }
    }

    if (!options.dryRun) {
      try {
        await createSymlink(source, destination);
        createdLinks.push({ type: item.type, name: item.name, source, destination, overrode: null });
        result.linksCreated++;

        if (item.type === "skill") {
          await restoreSkillConfig(destination, item.name);
        }
      } catch (err) {
        // Rollback previously created links
        for (const link of createdLinks) {
          try {
            await removeSymlink(link.destination);
          } catch {}
        }
        result.success = false;
        result.errors.push(`Failed to link ${item.name}: ${err instanceof Error ? err.message : String(err)}`);
        return result;
      }
    } else {
      result.linksCreated++;
    }
  }

  if (!options.dryRun && createdLinks.length > 0) {
    const activation: Activation = {
      profile: profile.name,
      target: target.kind,
      projectPath: target.kind === "project" ? target.projectPath : undefined,
      activatedAt: new Date().toISOString(),
      links: createdLinks,
    };
    await addActivation(activation);
  }

  return result;
}

function resolveProfileItems(profile: Profile): Array<{ type: "agent" | "command" | "skill"; name: string }> {
  return [
    ...profile.agents.map((a) => ({ type: "agent" as const, name: a })),
    ...profile.commands.map((c) => ({ type: "command" as const, name: c })),
    ...profile.skills.map((s) => ({ type: "skill" as const, name: s })),
  ];
}

function resolveSource(profilePath: string, type: "agent" | "command" | "skill", name: string): string {
  const subdir = type === "agent" ? "agents" : type === "command" ? "commands" : "skills";
  return path.join(profilePath, subdir, name);
}
