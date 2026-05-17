import fs from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { profilesDir } from "./config.js";
import type { Profile, ProfileYaml } from "./types.js";

const PROFILE_DEFAULTS: Omit<ProfileYaml, "name" | "description"> = {
  tags: [],
  agents: [],
  commands: [],
  skills: [],
  requires: [],
  conflicts: [],
};

export async function discoverProfiles(): Promise<Profile[]> {
  const dir = profilesDir();
  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch {
    return [];
  }

  const profiles: Profile[] = [];
  for (const entry of entries) {
    const profilePath = path.join(dir, entry);
    const stat = await fs.stat(profilePath);
    if (!stat.isDirectory()) continue;

    const profile = await loadProfile(profilePath);
    if (profile) profiles.push(profile);
  }

  return profiles.sort((a, b) => a.name.localeCompare(b.name));
}

export async function loadProfile(profilePath: string): Promise<Profile | null> {
  const yamlPath = path.join(profilePath, "profile.yaml");
  try {
    const raw = await fs.readFile(yamlPath, "utf-8");
    const parsed = parseYaml(raw) as Partial<ProfileYaml>;
    if (!parsed.name || !parsed.description) return null;

    return {
      ...PROFILE_DEFAULTS,
      ...parsed,
      name: parsed.name,
      description: parsed.description,
      path: profilePath,
    };
  } catch {
    return null;
  }
}

export async function findProfile(name: string): Promise<Profile | null> {
  const profilePath = path.join(profilesDir(), name);
  return loadProfile(profilePath);
}

export function profileItemCount(profile: Profile): { agents: number; commands: number; skills: number } {
  return {
    agents: profile.agents.length,
    commands: profile.commands.length,
    skills: profile.skills.length,
  };
}

export function formatItemCount(profile: Profile): string {
  const counts: string[] = [];
  if (profile.agents.length) counts.push(`${profile.agents.length} agent${profile.agents.length > 1 ? "s" : ""}`);
  if (profile.commands.length) counts.push(`${profile.commands.length} command${profile.commands.length > 1 ? "s" : ""}`);
  if (profile.skills.length) counts.push(`${profile.skills.length} skill${profile.skills.length > 1 ? "s" : ""}`);
  return counts.join(", ") || "empty";
}
