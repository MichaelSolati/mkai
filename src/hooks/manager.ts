import {spawn} from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

import {profilesDir} from '../config.js';
import {readState} from '../state.js';
import type {Profile} from '../types.js';

const HOOK_COMMAND = 'cpx dispatch';

export async function injectDispatcher(
  targetDir: string,
  profile: Profile,
): Promise<void> {
  const settingsPath = path.join(targetDir, 'settings.json');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let settings: Record<string, any> = {};

  try {
    const raw = await fs.readFile(settingsPath, 'utf-8');
    settings = JSON.parse(raw);
  } catch {
    // settings.json might not exist, start fresh
    console.warn(`No settings.json found in ${targetDir}, creating new one...`);
  }

  if (!settings.hooks) settings.hooks = {};

  const profileHooksDir = path.join(profile.path, 'hooks');
  let events: string[] = [];
  try {
    events = await fs.readdir(profileHooksDir);
  } catch {
    console.warn(`No hooks found for profile "${profile.name}"`);
    return;
  }

  for (const event of events) {
    if (!settings.hooks[event]) settings.hooks[event] = [];

    // 1. Cleanup: Remove any old "flat" hooks that were incorrectly added in previous versions
    settings.hooks[event] = settings.hooks[event].filter(
      (h: {command?: string; hooks?: any}) =>
        !(h.command && h.command.includes(HOOK_COMMAND)),
    );

    // 2. Find or create a group that contains our hook command
    let group = settings.hooks[event].find(
      (g: {hooks?: Array<{command?: string}>}) =>
        g.hooks && g.hooks.find(h => h.command && h.command.includes(HOOK_COMMAND)),
    );

    if (group && (group.matcher === '' || group.matcher === undefined)) {
      group.matcher = '.*';
    }

    if (!group) {
      settings.hooks[event].push({
        matcher: '.*', // Match all tools
        hooks: [
          {
            type: 'command',
            command: `${HOOK_COMMAND} ${event}`,
          },
        ],
      });
    }
  }

  await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2) + '\n');
}

export async function removeDispatcher(targetDir: string): Promise<void> {
  const settingsPath = path.join(targetDir, 'settings.json');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let settings: Record<string, any> = {};

  try {
    const raw = await fs.readFile(settingsPath, 'utf-8');
    settings = JSON.parse(raw);
  } catch {
    return;
  }

  if (!settings.hooks) return;

  for (const event in settings.hooks) {
    const groups = settings.hooks[event];
    if (!Array.isArray(groups)) continue;

    for (let i = groups.length - 1; i >= 0; i--) {
      const group = groups[i];
      if (!group.hooks) continue;

      group.hooks = group.hooks.filter(
        (h: {command?: string}) =>
          !(h.command && h.command.includes(HOOK_COMMAND)),
      );

      if (group.hooks.length === 0) {
        groups.splice(i, 1);
      }
    }

    if (groups.length === 0) {
      delete settings.hooks[event];
    }
  }

  if (Object.keys(settings.hooks).length === 0) {
    delete settings.hooks;
  }

  await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2) + '\n');
}

/**
 * Executes CPX-managed hooks for an event.
 */
export async function runDispatch(
  eventName: string,
  payload: string,
): Promise<number> {
  const state = await readState();
  const cwd = process.cwd();

  // Debug logging
  try {
    await fs.appendFile(
      '/tmp/cpx-debug.log',
      `[${new Date().toISOString()}] Dispatch: ${eventName} in ${cwd}\nPayload: ${payload.substring(0, 200)}...\n`,
    );
  } catch {
    // Ignore logging errors
  }

  const activeActivations = state.activations.filter(
    a =>
      a.target === 'global' ||
      (a.projectPath &&
        (cwd === a.projectPath || cwd.startsWith(a.projectPath + path.sep))),
  );

  if (activeActivations.length === 0) return 0;

  const baseProfilesDir = profilesDir();
  let overallExitCode = 0;

  for (const activation of activeActivations) {
    const profilePath = path.join(baseProfilesDir, activation.profile);
    const hooksDir = path.join(profilePath, 'hooks', eventName);

    try {
      const hookFiles = (await fs.readdir(hooksDir)).sort();
      for (const file of hookFiles) {
        if (file.startsWith('.')) continue;
        const hookPath = path.join(hooksDir, file);

        const exitCode = await executeHook(hookPath, payload);
        if (exitCode === 2) return 2;
        if (exitCode !== 0) overallExitCode = exitCode;
      }
    } catch {
      continue;
    }
  }

  return overallExitCode;
}

function executeHook(hookPath: string, payload: string): Promise<number> {
  return new Promise(resolve => {
    const child = spawn(hookPath, [], {
      stdio: ['pipe', 'inherit', 'inherit'],
      shell: true,
    });
    child.stdin.write(payload);
    child.stdin.end();
    child.on('close', code => resolve(code ?? 0));
    child.on('error', () => resolve(1));
  });
}
