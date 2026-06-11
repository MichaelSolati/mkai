import * as p from '@clack/prompts';
import chalk from 'chalk';

import {activateProfile, type ActivateResult} from './activate.js';
import {deactivateProfile} from './deactivate.js';
import {discoverProfiles, formatItemCount} from './profile.js';
import {readState} from './state.js';
import {isHealthySymlink} from './symlink.js';
import type {Target} from './types.js';

export async function runTui(): Promise<void> {
  p.intro(chalk.bold('cpx'));

  while (true) {
    const action = await p.select({
      message: 'What would you like to do?',
      options: [
        {value: 'activate', label: 'Activate profiles'},
        {value: 'deactivate', label: 'Deactivate profiles'},
        {value: 'status', label: 'View status'},
        {value: 'check', label: 'Check health'},
        {value: 'exit', label: 'Exit'},
      ],
    });

    if (p.isCancel(action) || action === 'exit') {
      p.outro('Done!');
      return;
    }

    switch (action) {
      case 'activate':
        await tuiActivate();
        break;
      case 'deactivate':
        await tuiDeactivate();
        break;
      case 'status':
        await tuiStatus();
        break;
      case 'check':
        await tuiCheck();
        break;
    }
  }
}

async function tuiActivate(): Promise<void> {
  const profiles = await discoverProfiles();
  const state = await readState();

  if (profiles.length === 0) {
    p.log.warn('No profiles found in profiles/ directory.');
    return;
  }

  const target = await selectTarget();
  if (!target) return;

  const isActiveHere = (name: string) =>
    state.activations.some(
      a =>
        a.profile === name &&
        a.target === target.kind &&
        (target.kind === 'global' || a.projectPath === target.projectPath),
    );

  const selected = await p.multiselect({
    message: 'Select profiles to activate:',
    options: profiles.map(prof => ({
      value: prof.name,
      label: `${prof.name}${isActiveHere(prof.name) ? chalk.green(' [ACTIVE]') : ''}`,
      hint: formatItemCount(prof),
    })),
  });

  if (p.isCancel(selected)) return;

  for (const name of selected) {
    const alreadyActiveHere = state.activations.some(
      a =>
        a.profile === name &&
        a.target === target.kind &&
        (target.kind === 'global' || a.projectPath === target.projectPath),
    );
    if (alreadyActiveHere) {
      p.log.info(`${name} is already active - skipping.`);
      continue;
    }

    const profile = profiles.find(prof => prof.name === name)!;
    const result = await activateProfile(profile, target, {
      onConflict: async conflict => {
        const answer = await p.confirm({
          message: `${conflict.name} already exists in target. Override? (original will be stashed)`,
        });
        return !p.isCancel(answer) && answer;
      },
    });

    reportActivateResult(name, result);
  }
}

async function tuiDeactivate(): Promise<void> {
  const state = await readState();
  const cwd = process.cwd();
  const activations = state.activations.filter(
    a => a.target === 'global' || a.projectPath === cwd,
  );

  if (activations.length === 0) {
    p.log.warn('No active profiles.');
    return;
  }

  const options = [
    ...activations.map(a => ({
      value: a.profile,
      label: `${a.profile} (${a.target}${a.projectPath ? `: ${a.projectPath}` : ''})`,
      hint: `${a.links.length} links`,
    })),
    {
      value: '__all__',
      label: 'Deactivate all shown',
      hint: `${activations.length} profiles`,
    },
  ];

  const selected = await p.select({
    message: 'Which profile to deactivate?',
    options,
  });
  if (p.isCancel(selected)) return;

  if (selected === '__all__') {
    for (const activation of activations) {
      const target: Target =
        activation.target === 'project' && activation.projectPath
          ? {kind: 'project', projectPath: activation.projectPath}
          : {kind: 'global'};
      const result = await deactivateProfile(activation.profile, target);
      p.log.success(
        `Deactivated "${activation.profile}" - ${result.linksRemoved} links removed, ${result.restored} originals restored.`,
      );
    }
  } else {
    const activation = activations.find(a => a.profile === selected)!;
    const target: Target =
      activation.target === 'project' && activation.projectPath
        ? {kind: 'project', projectPath: activation.projectPath}
        : {kind: 'global'};
    const result = await deactivateProfile(selected, target);
    p.log.success(
      `Deactivated "${selected}" - ${result.linksRemoved} links removed, ${result.restored} originals restored.`,
    );
  }
}

async function tuiStatus(): Promise<void> {
  const state = await readState();
  const cwd = process.cwd();
  const activations = state.activations.filter(
    a => a.target === 'global' || a.projectPath === cwd,
  );

  if (activations.length === 0) {
    p.log.info('No active profiles.');
    return;
  }

  for (const activation of activations) {
    p.log.info(
      `${chalk.bold(activation.profile)} (${activation.target}${activation.projectPath ? `: ${activation.projectPath}` : ''}) - ${activation.links.length} links`,
    );
  }
}

async function tuiCheck(): Promise<void> {
  const state = await readState();
  let broken = 0;

  for (const activation of state.activations) {
    for (const link of activation.links) {
      const healthy = await isHealthySymlink(link.destination);
      if (!healthy) {
        p.log.warn(
          `${chalk.red('broken')} ${activation.profile}/${link.name} → ${link.destination}`,
        );
        broken++;
      }
    }
  }

  if (broken === 0) {
    p.log.success('All symlinks healthy.');
  } else {
    p.log.error(`${broken} broken symlink${broken > 1 ? 's' : ''} found.`);
  }
}

async function selectTarget(): Promise<Target | null> {
  const choice = await p.select({
    message: 'Target?',
    options: [
      {value: 'global', label: 'Global (~/.claude)'},
      {value: 'project', label: `Project (${process.cwd()})`},
    ],
  });

  if (p.isCancel(choice)) return null;

  if (choice === 'project') {
    return {kind: 'project', projectPath: process.cwd()};
  }
  return {kind: 'global'};
}

function reportActivateResult(name: string, result: ActivateResult): void {
  if (result.success) {
    const parts = [`${result.linksCreated} links created`];
    if (result.overridden) parts.push(`${result.overridden} overridden`);
    if (result.skipped) parts.push(`${result.skipped} skipped`);
    p.log.success(`Activated "${name}" - ${parts.join(', ')}.`);
  } else {
    p.log.error(`Failed to activate "${name}": ${result.errors.join('; ')}`);
  }
}
