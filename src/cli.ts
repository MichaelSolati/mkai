import chalk from 'chalk';
import {Command} from 'commander';

import {activateProfile} from './activate.js';
import {profilesDir} from './config.js';
import {deactivateAll, deactivateProfile} from './deactivate.js';
import {runDispatch} from './hooks/manager.js';
import {discoverProfiles, findProfile, formatItemCount} from './profile.js';
import {isActive, readState} from './state.js';
import {isHealthySymlink} from './symlink.js';
import {runTui} from './tui.js';
import type {Target} from './types.js';

const program = new Command();

program
  .name('cpx')
  .description(
    'Claude Profile Loader - manage groups of agents, skills, and commands',
  )
  .version('0.1.0')
  .action(async () => {
    await runTui();
  });

program
  .command('list')
  .description('List all available profiles')
  .option('--json', 'Output as JSON')
  .action(async opts => {
    const profiles = await discoverProfiles();
    const state = await readState();

    if (opts.json) {
      const data = profiles.map(p => ({
        name: p.name,
        description: p.description,
        tags: p.tags,
        active: isActive(state, p.name),
        agents: p.agents.length,
        commands: p.commands.length,
        skills: p.skills.length,
      }));
      console.log(JSON.stringify(data, null, 2));
      return;
    }

    if (profiles.length === 0) {
      console.log('No profiles found.');
      return;
    }

    for (const prof of profiles) {
      const active = isActive(state, prof.name);
      const status = active ? chalk.green(' [ACTIVE]') : '';
      console.log(
        `  ${chalk.bold(prof.name)}${status} - ${formatItemCount(prof)}`,
      );
      console.log(`    ${chalk.dim(prof.description)}`);
    }
  });

program
  .command('status')
  .description('Show currently active profiles')
  .option('--json', 'Output as JSON')
  .option('--all', 'Show all activations across all projects')
  .action(async opts => {
    const state = await readState();
    const cwd = process.cwd();

    const activations = opts.all
      ? state.activations
      : state.activations.filter(
          a => a.target === 'global' || a.projectPath === cwd,
        );

    if (opts.json) {
      console.log(JSON.stringify(activations, null, 2));
      return;
    }

    if (activations.length === 0) {
      console.log('No active profiles.');
      return;
    }

    for (const activation of activations) {
      const targetLabel =
        activation.target === 'project'
          ? `project: ${activation.projectPath}`
          : 'global';
      console.log(
        `  ${chalk.bold(activation.profile)} (${targetLabel}) - ${activation.links.length} links`,
      );
      for (const link of activation.links) {
        const override = link.overrode ? chalk.yellow(' [override]') : '';
        console.log(`    ${chalk.dim(link.type)} ${link.name}${override}`);
      }
    }
  });

program
  .command('activate')
  .description('Activate one or more profiles')
  .argument('<profiles...>', 'Profile names to activate')
  .option('--project', 'Activate into CWD/.claude/ instead of ~/.claude')
  .option('--force', 'Override conflicts without prompting')
  .option('--dry-run', 'Show what would happen without doing it')
  .action(async (profileNames: string[], opts) => {
    const target: Target = opts.project
      ? {kind: 'project', projectPath: process.cwd()}
      : {kind: 'global'};

    for (const name of profileNames) {
      const profile = await findProfile(name);
      if (!profile) {
        console.error(chalk.red(`Profile "${name}" not found.`));
        continue;
      }

      const result = await activateProfile(profile, target, {
        force: opts.force,
        dryRun: opts.dryRun,
      });

      if (result.success) {
        const prefix = opts.dryRun ? '[dry-run] ' : '';
        console.log(
          chalk.green(
            `${prefix}Activated "${name}" - ${result.linksCreated} links created.`,
          ),
        );
      } else {
        console.error(
          chalk.red(
            `Failed to activate "${name}": ${result.errors.join('; ')}`,
          ),
        );
      }
    }
  });

program
  .command('deactivate')
  .description('Deactivate one or more profiles')
  .argument('[profiles...]', 'Profile names to deactivate')
  .option('--all', 'Deactivate all active profiles')
  .option('--dry-run', 'Show what would happen without doing it')
  .action(async (profileNames: string[], opts) => {
    if (opts.all) {
      const result = await deactivateAll({dryRun: opts.dryRun});
      const prefix = opts.dryRun ? '[dry-run] ' : '';
      console.log(
        chalk.green(
          `${prefix}Deactivated all - ${result.linksRemoved} links removed.`,
        ),
      );
      return;
    }

    if (profileNames.length === 0) {
      console.error('Specify profile names or use --all.');
      process.exit(1);
    }

    const state = await readState();
    for (const name of profileNames) {
      const activation = state.activations.find(a => a.profile === name);
      if (!activation) {
        console.error(chalk.red(`Profile "${name}" is not active.`));
        continue;
      }

      const target: Target =
        activation.target === 'project' && activation.projectPath
          ? {kind: 'project', projectPath: activation.projectPath}
          : {kind: 'global'};

      const result = await deactivateProfile(name, target, {
        dryRun: opts.dryRun,
      });
      const prefix = opts.dryRun ? '[dry-run] ' : '';
      console.log(
        chalk.green(
          `${prefix}Deactivated "${name}" - ${result.linksRemoved} links removed.`,
        ),
      );
    }
  });

program
  .command('check')
  .description('Validate symlink health')
  .action(async () => {
    const state = await readState();
    let broken = 0;
    let total = 0;

    for (const activation of state.activations) {
      for (const link of activation.links) {
        total++;
        const healthy = await isHealthySymlink(link.destination);
        if (!healthy) {
          console.log(
            chalk.red(
              `  broken: ${activation.profile}/${link.name} → ${link.destination}`,
            ),
          );
          broken++;
        }
      }
    }

    if (total === 0) {
      console.log('No active profiles to check.');
    } else if (broken === 0) {
      console.log(chalk.green(`All ${total} symlinks healthy.`));
    } else {
      console.log(chalk.red(`${broken}/${total} broken.`));
      process.exit(1);
    }
  });

program
  .command('init')
  .description('Scaffold a new profile')
  .argument('<name>', 'Profile name')
  .action(async (name: string) => {
    const fs = await import('node:fs/promises');
    const path = await import('node:path');

    const dir = path.join(profilesDir(), name);
    try {
      await fs.access(dir);
      console.error(chalk.red(`Profile "${name}" already exists.`));
      process.exit(1);
    } catch {
      console.warn(`Creating profile "${name}"`);
    }

    await fs.mkdir(path.join(dir, 'agents'), {recursive: true});
    await fs.mkdir(path.join(dir, 'commands'), {recursive: true});
    await fs.mkdir(path.join(dir, 'skills'), {recursive: true});

    const yaml = `name: ${name}
description: ""
tags: []

agents: []
commands: []
skills: []

requires: []
conflicts: []
`;
    await fs.writeFile(path.join(dir, 'profile.yaml'), yaml);
    console.log(chalk.green(`Created profile scaffold at profiles/${name}/`));
  });

program
  .command('dispatch')
  .description('Handle Claude Code hooks (internal use)')
  .argument('<event>', 'Hook event name')
  .action(async (event: string) => {
    let payload = '';
    process.stdin.on('data', chunk => {
      payload += chunk;
    });

    process.stdin.on('end', async () => {
      const exitCode = await runDispatch(event, payload);
      process.exit(exitCode);
    });
  });

program.parse();
