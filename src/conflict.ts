import fs from "node:fs/promises";
import path from "node:path";
import { resolveItemDestination } from "./config.js";
import type { Conflict, Profile } from "./types.js";
import { readState } from "./state.js";

export async function detectConflicts(profile: Profile, targetDir: string): Promise<Conflict[]> {
  const conflicts: Conflict[] = [];
  const state = await readState();

  const items: Array<{ type: "agent" | "command" | "skill"; name: string }> = [
    ...profile.agents.map((a) => ({ type: "agent" as const, name: a })),
    ...profile.commands.map((c) => ({ type: "command" as const, name: c })),
    ...profile.skills.map((s) => ({ type: "skill" as const, name: s })),
  ];

  for (const item of items) {
    const dest = resolveItemDestination(targetDir, item.type, item.name);
    const conflict = await checkDestination(dest, item.type, item.name, profile.name, state);
    if (conflict) conflicts.push(conflict);
  }

  return conflicts;
}

async function checkDestination(
  dest: string,
  type: "agent" | "command" | "skill",
  name: string,
  profileName: string,
  state: { activations: Array<{ profile: string; links: Array<{ destination: string }> }> },
): Promise<Conflict | null> {
  try {
    const stat = await fs.lstat(dest);

    if (stat.isSymbolicLink()) {
      const target = await fs.readlink(dest);

      // Check if owned by another profile
      const ownerActivation = state.activations.find((a) =>
        a.links.some((l) => l.destination === dest),
      );

      if (ownerActivation) {
        if (ownerActivation.profile === profileName) {
          return { type, name, destination: dest, kind: "symlink-same-profile" };
        }
        return {
          type,
          name,
          destination: dest,
          kind: "symlink-other-profile",
          ownedByProfile: ownerActivation.profile,
        };
      }

      // Symlink exists but not tracked - could be broken
      try {
        await fs.stat(dest);
      } catch {
        return { type, name, destination: dest, kind: "broken-symlink" };
      }
    }

    return { type, name, destination: dest, kind: "real-file" };
  } catch {
    // Destination doesn't exist - no conflict
    return null;
  }
}
