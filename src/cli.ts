import chalk from 'chalk';
import {Command} from 'commander';

import {activateProfile} from './activate.js';
import {profilesDir} from './config.js';
import {deactivateAll, deactivateProfile} from './deactivate.js';
import {runDispatch} from './hooks/manager.js';
import {discoverProfiles, findProfile, formatItemCount} from './profile.js';
import {isActive, readState} from './state.js';
import {exists, isHealthySymlink} from './symlink.js';
import {runTui} from './tui.js';
import type {Platform, Target} from './types.js';

const program = new Command();

program
  .name('cpx')
  .description(
    'AI Profile Loader - manage groups of agents, skills, and commands for Claude Code and Gemini CLI',
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
      const platformLabel = chalk.cyan(`[${activation.platform}]`);
      console.log(
        `  ${chalk.bold(activation.profile)} ${platformLabel} (${targetLabel}) - ${activation.links.length} links`,
      );
      for (const link of activation.links) {
        const override = link.overrode ? chalk.yellow(' [override]') : '';
        const generated = link.isGenerated ? chalk.magenta(' [generated]') : '';
        console.log(
          `    ${chalk.dim(link.type)} ${link.name}${override}${generated}`,
        );
      }
    }
  });

program
  .command('activate')
  .description('Activate one or more profiles')
  .argument('<profiles...>', 'Profile names to activate')
  .option(
    '-p, --platform <platform>',
    'Platform to target (claude or gemini)',
    'claude',
  )
  .option(
    '-t, --target <target>',
    'Target location (global or project)',
    'global',
  )
  .option('--force', 'Override conflicts without prompting')
  .option('--dry-run', 'Show what would happen without doing it')
  .action(async (profileNames: string[], opts) => {
    const platform = opts.platform as Platform;
    const target: Target =
      opts.target === 'project'
        ? {kind: 'project', projectPath: process.cwd(), platform}
        : {kind: 'global', platform};

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
        const parts = [`${result.linksCreated} links created`];
        if (result.overridden) parts.push(`${result.overridden} overridden`);
        if (result.skipped) parts.push(`${result.skipped} skipped`);
        console.log(
          chalk.green(
            `${prefix}Activated "${name}" for ${platform} - ${parts.join(', ')}.`,
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
  .option(
    '-p, --platform <platform>',
    'Platform to target (claude or gemini)',
    'claude',
  )
  .option(
    '-t, --target <target>',
    'Target location (global, project, or all)',
    'all',
  )
  .option('--all', 'Deactivate all active profiles')
  .option('--dry-run', 'Show what would happen without doing it')
  .action(async (profileNames: string[], opts) => {
    const platform = opts.platform as Platform;

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
      const activations = state.activations.filter(
        a =>
          a.profile === name &&
          a.platform === platform &&
          (opts.target === 'all' || a.target === opts.target),
      );

      if (activations.length === 0) {
        console.error(
          chalk.red(
            `Profile "${name}" is not active on ${platform}${opts.target !== 'all' ? ` for ${opts.target}` : ''}.`,
          ),
        );
        continue;
      }

      for (const activation of activations) {
        const target: Target =
          activation.target === 'project' && activation.projectPath
            ? {
                kind: 'project',
                projectPath: activation.projectPath,
                platform: activation.platform,
              }
            : {kind: 'global', platform: activation.platform};

        const result = await deactivateProfile(name, target, {
          dryRun: opts.dryRun,
        });
        const prefix = opts.dryRun ? '[dry-run] ' : '';
        console.log(
          chalk.green(
            `${prefix}Deactivated "${name}" from ${platform} (${activation.target}) - ${result.linksRemoved} links removed.`,
          ),
        );
      }
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
        const healthy = link.isGenerated
          ? await exists(link.destination)
          : await isHealthySymlink(link.destination);

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
  .option('--platform <platform>', 'Platform to target')
  .action(async (event: string, opts) => {
    let payload = '';
    process.stdin.on('data', chunk => {
      payload += chunk;
    });

    process.stdin.on('end', async () => {
      let platform = opts.platform as Platform | undefined;

      // Auto-detect platform if not provided
      if (!platform) {
        if (process.env.CLAUDE_CODE === '1' || process.env.CLAUDE_PROJECT_ID) {
          platform = 'claude';
        } else if (
          process.env.GEMINI_CLI === '1' ||
          process.env.GEMINI_PROJECT_ID
        ) {
          platform = 'gemini';
        } else {
          // Fallback: look for local config dirs
          const fs = await import('node:fs/promises');
          try {
            await fs.access('.gemini');
            platform = 'gemini';
          } catch {
            try {
              await fs.access('.claude');
              platform = 'claude';
            } catch {
              // Final fallback
              platform = 'claude';
            }
          }
        }
      }

      const {exitCode, stdout, stderr} = await runDispatch(
        event,
        payload,
        platform,
      );
      if (stdout) process.stdout.write(stdout);
      if (stderr) process.stderr.write(stderr);
      process.exit(exitCode);
    });
  });

program.parse();
