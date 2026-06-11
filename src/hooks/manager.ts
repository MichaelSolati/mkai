import {spawn} from 'child_process';
import fs from 'fs/promises';
import path from 'path';

import {profilesDir} from '../config';
import {readState} from '../state';
import type {Activation, Platform, Profile} from '../types';

const HOOK_COMMAND = 'mkai dispatch';

/**
 * Maps profile-defined events (usually Claude-named) to platform-specific events.
 */
function mapEvent(event: string, platform: Platform): string {
  if (platform === 'claude') return event;

  const mapping: Record<string, string> = {
    PreToolUse: 'BeforeTool',
    TaskCompleted: 'AfterTool',
    SessionStart: 'SessionStart',
  };

  return mapping[event] || event;
}

export async function injectDispatcher(
  targetDir: string,
  profile: Profile,
  platform: Platform,
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
    const targetEvent = mapEvent(event, platform);
    if (!settings.hooks[targetEvent]) settings.hooks[targetEvent] = [];

    // Find or create a group that contains our hook command
    const group = settings.hooks[targetEvent].find(
      (g: {hooks?: Array<{command?: string}>}) =>
        g.hooks &&
        g.hooks.find(h => h.command && h.command.includes(HOOK_COMMAND)),
    );

    if (group && (group.matcher === '' || group.matcher === undefined)) {
      group.matcher = '.*';
    }

    if (!group) {
      settings.hooks[targetEvent].push({
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

export async function removeDispatcher(
  targetDir: string,
  _platform: Platform,
): Promise<void> {
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
 * Executes MKAI-managed hooks for an event.
 */
export async function runDispatch(
  eventName: string,
  payload: string,
  platform: Platform,
): Promise<{exitCode: number; stdout: string; stderr: string}> {
  const state = await readState();
  const cwd = process.cwd();

  let activeActivations = state.activations.filter(
    a =>
      a.platform === platform &&
      (a.target === 'global' ||
        (a.projectPath &&
          (cwd === a.projectPath || cwd.startsWith(a.projectPath + path.sep)))),
  );

  // De-duplicate activations for the same profile (prefer project over global if both exist)
  const uniqueActivationsMap = new Map<string, Activation>();
  for (const a of activeActivations) {
    const existing = uniqueActivationsMap.get(a.profile);
    if (!existing || a.target === 'project') {
      uniqueActivationsMap.set(a.profile, a);
    }
  }
  activeActivations = Array.from(uniqueActivationsMap.values());

  if (activeActivations.length === 0) {
    return {exitCode: 0, stdout: '', stderr: ''};
  }

  const baseProfilesDir = profilesDir();
  let overallExitCode = 0;
  let overallStderr = '';
  let plainStdout = '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jsonResults: any[] = [];

  for (const activation of activeActivations) {
    const profilePath = path.join(baseProfilesDir, activation.profile);
    const hooksDir = path.join(profilePath, 'hooks', eventName);

    try {
      const entries = await fs.readdir(hooksDir);
      const hookFiles = entries.sort();
      for (const file of hookFiles) {
        if (file.startsWith('.')) continue;
        const hookPath = path.join(hooksDir, file);

        const {exitCode, stdout, stderr} = await executeHook(hookPath, payload);
        overallStderr += stderr;

        if (stdout.trim()) {
          try {
            const parsed = JSON.parse(stdout.trim());
            jsonResults.push(parsed);
          } catch {
            plainStdout += stdout;
          }
        }

        if (exitCode === 2) {
          overallExitCode = 2;
          // If we block, we stop running hooks for this event
          break;
        }
        if (exitCode !== 0) overallExitCode = exitCode;
      }
      if (overallExitCode === 2) break;
    } catch {
      continue;
    }
  }

  let finalStdout = plainStdout;

  if (jsonResults.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const merged: any = {};

    for (const res of jsonResults) {
      // Merge decision/permissionDecision (deny/block take precedence)
      if (res.decision === 'deny' || res.decision === 'block') {
        merged.decision = 'deny';
      } else if (res.decision && !merged.decision) {
        merged.decision = res.decision;
      }

      if (
        res.permissionDecision === 'deny' ||
        res.permissionDecision === 'block'
      ) {
        merged.permissionDecision = 'deny';
      } else if (res.permissionDecision && !merged.permissionDecision) {
        merged.permissionDecision = res.permissionDecision;
      }

      // Concatenate reasons
      if (res.reason) {
        merged.reason = merged.reason
          ? `${merged.reason}\n${res.reason}`
          : res.reason;
      }

      // Merge hookSpecificOutput
      if (res.hookSpecificOutput) {
        if (!merged.hookSpecificOutput) merged.hookSpecificOutput = {};
        if (res.hookSpecificOutput.additionalContext) {
          merged.hookSpecificOutput.additionalContext = merged
            .hookSpecificOutput.additionalContext
            ? `${merged.hookSpecificOutput.additionalContext}\n${res.hookSpecificOutput.additionalContext}`
            : res.hookSpecificOutput.additionalContext;
        }
      }

      // Merge suppressOutput
      if (res.suppressOutput === true) {
        merged.suppressOutput = true;
      }

      // Add other fields (shallow merge)
      for (const key in res) {
        if (
          ![
            'decision',
            'permissionDecision',
            'reason',
            'hookSpecificOutput',
            'suppressOutput',
          ].includes(key)
        ) {
          merged[key] = res[key];
        }
      }
    }

    // If we have plain stdout AND merged JSON, and we are on Gemini,
    // we should probably put plain stdout into additionalContext or systemMessage
    if (platform === 'gemini') {
      if (plainStdout) {
        if (!merged.hookSpecificOutput) merged.hookSpecificOutput = {};
        merged.hookSpecificOutput.additionalContext = merged.hookSpecificOutput
          .additionalContext
          ? `${plainStdout}\n${merged.hookSpecificOutput.additionalContext}`
          : plainStdout;
      }
      if (Object.keys(merged).length > 0 || jsonResults.length > 0) {
        finalStdout = JSON.stringify(merged, null, 2);
      }
    } else {
      // Claude Code
      if (eventName === 'SessionStart' || eventName === 'UserPromptSubmit') {
        // These events in Claude Code prefer plain text for injection
        if (Object.keys(merged).length > 0) {
          // If we have JSON context, extract it
          const context =
            merged.additionalContext ||
            (merged.hookSpecificOutput &&
              merged.hookSpecificOutput.additionalContext);
          finalStdout = `${plainStdout}${context ? `\n${context}` : ''}`;
        } else {
          finalStdout = plainStdout;
        }
      } else {
        // Other events (PreToolUse, TaskCompleted) expect JSON if there's any structured decision
        if (Object.keys(merged).length > 0 || jsonResults.length > 0) {
          finalStdout = JSON.stringify(merged, null, 2);
        } else {
          finalStdout = plainStdout;
        }
      }
    }
  }

  return {
    exitCode: overallExitCode,
    stdout: finalStdout,
    stderr: overallStderr,
  };
}

function executeHook(
  hookPath: string,
  payload: string,
): Promise<{exitCode: number; stdout: string; stderr: string}> {
  return new Promise(resolve => {
    let stdout = '';
    let stderr = '';
    const child = spawn(hookPath, [], {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true,
    });

    child.stdout.on('data', data => {
      stdout += data.toString();
    });

    child.stderr.on('data', data => {
      stderr += data.toString();
    });

    child.stdin.write(payload);
    child.stdin.end();

    child.on('close', code =>
      resolve({
        exitCode: code ?? 0,
        stdout,
        stderr,
      }),
    );

    child.on('error', () =>
      resolve({
        exitCode: 1,
        stdout,
        stderr,
      }),
    );
  });
}
