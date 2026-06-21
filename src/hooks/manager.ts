import {spawn} from 'child_process';
import fs from 'fs/promises';
import path from 'path';

import {profilesDir} from '../config';
import {readState} from '../state';
import type {
  Activation,
  Platform,
  Profile,
  StandardHookInput,
  StandardHookOutput,
} from '../types';

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
 * Normalizes an incoming agent hook payload into standard HookInput context.
 */
export function toStandardInput(
  eventName: string,
  payloadStr: string,
  platform: Platform,
): StandardHookInput {
  let cwd = process.cwd();
  let sessionId: string | undefined;
  let rawEventName = eventName;
  let toolCall: StandardHookInput['toolCall'] | undefined;

  try {
    const data = JSON.parse(payloadStr);

    if (data.cwd) cwd = data.cwd;

    if (data.session_id) sessionId = data.session_id;
    else if (data.sessionId) sessionId = data.sessionId;

    if (data.hook_event_name) rawEventName = data.hook_event_name;
    else if (data.hookEventName) rawEventName = data.hookEventName;
    else if (data.event) rawEventName = data.event;

    const toolName =
      data.tool_name || data.tool || data.call?.tool || data.name;
    const toolArgs =
      data.tool_input || data.arguments || data.call?.arguments || data.args;
    if (toolName) {
      toolCall = {
        name: toolName,
        arguments: toolArgs || {},
      };
    }
  } catch {
    // Ignore JSON parsing issues (e.g. empty stdin)
  }

  let stdEvent = eventName;
  if (rawEventName.startsWith('SessionStart')) {
    stdEvent = 'SessionStart';
  } else if (rawEventName === 'BeforeTool' || rawEventName === 'PreToolUse') {
    stdEvent = 'PreToolUse';
  } else if (rawEventName === 'AfterTool' || rawEventName === 'TaskCompleted') {
    stdEvent = 'TaskCompleted';
  }

  return {
    platform,
    eventName: stdEvent,
    rawEventName,
    cwd,
    sessionId,
    toolCall,
    rawPayload: payloadStr,
  };
}

/**
 * Transforms standard hook output into agent-specific formats.
 */

export function toAgentOutput(
  merged: StandardHookOutput,
  platform: Platform,
  rawEventName: string,
): Record<string, unknown> {
  if (platform === 'claude') {
    const response: Record<string, unknown> = {
      hookSpecificOutput: {
        hookEventName: rawEventName,
      },
    };

    if (merged.decision) {
      response.permissionDecision = merged.decision;
      (
        response.hookSpecificOutput as Record<string, unknown>
      ).permissionDecision = merged.decision;
    }
    if (merged.reason) {
      response.reason = merged.reason;
      (
        response.hookSpecificOutput as Record<string, unknown>
      ).permissionDecisionReason = merged.reason;
      (response.hookSpecificOutput as Record<string, unknown>).reason =
        merged.reason;
    }
    if (merged.additionalContext) {
      (
        response.hookSpecificOutput as Record<string, unknown>
      ).additionalContext = merged.additionalContext;
      response.additionalContext = merged.additionalContext;
    }
    if (merged.suppressOutput === true) {
      response.suppressOutput = true;
    }

    return response;
  } else {
    // Gemini CLI
    const response: Record<string, unknown> = {};

    if (merged.decision) {
      response.decision = merged.decision;
    }
    if (merged.reason) {
      response.reason = merged.reason;
    }
    if (merged.suppressOutput === true) {
      response.suppressOutput = true;
    }
    if (merged.additionalContext) {
      response.hookSpecificOutput = {
        additionalContext: merged.additionalContext,
      };
    }

    return response;
  }
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

  // Convert incoming payload to StandardHookInput
  const standardInput = toStandardInput(eventName, payload, platform);
  const serializedInput = JSON.stringify(standardInput, null, 2);

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

        const {exitCode, stdout, stderr} = await executeHook(
          hookPath,
          serializedInput,
        );
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

  let finalStdout = '';

  if (jsonResults.length > 0 || plainStdout.trim()) {
    const mergedOutput: StandardHookOutput = {};

    for (const res of jsonResults) {
      // Map potential legacy properties into standard properties
      const output: StandardHookOutput = {
        decision:
          res.decision ||
          (res.hookSpecificOutput &&
            res.hookSpecificOutput.permissionDecision) ||
          res.permissionDecision,
        reason:
          res.reason ||
          (res.hookSpecificOutput &&
            (res.hookSpecificOutput.permissionDecisionReason ||
              res.hookSpecificOutput.reason)),
        additionalContext:
          res.additionalContext ||
          (res.hookSpecificOutput && res.hookSpecificOutput.additionalContext),
        suppressOutput: res.suppressOutput,
      };

      // Merge decision
      if (output.decision === 'deny') {
        mergedOutput.decision = 'deny';
      } else if (output.decision && !mergedOutput.decision) {
        mergedOutput.decision = output.decision;
      }

      // Merge reason
      if (output.reason) {
        mergedOutput.reason = mergedOutput.reason
          ? `${mergedOutput.reason}\n${output.reason}`
          : output.reason;
      }

      // Merge additionalContext
      if (output.additionalContext) {
        mergedOutput.additionalContext = mergedOutput.additionalContext
          ? `${mergedOutput.additionalContext}\n${output.additionalContext}`
          : output.additionalContext;
      }

      // Merge suppressOutput
      if (output.suppressOutput === true) {
        mergedOutput.suppressOutput = true;
      }
    }

    if (plainStdout.trim()) {
      mergedOutput.additionalContext = mergedOutput.additionalContext
        ? `${plainStdout.trim()}\n${mergedOutput.additionalContext}`
        : plainStdout.trim();
    }

    const finalResult = toAgentOutput(
      mergedOutput,
      platform,
      standardInput.rawEventName,
    );
    finalStdout = JSON.stringify(finalResult, null, 2);
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
