import fs from 'fs/promises';

import {paths} from './config.js';
import type {Activation, State} from './types.js';

const EMPTY_STATE: State = {
  version: 1,
  profilesRepo: '',
  activations: [],
};

export async function ensureStateDir(): Promise<void> {
  await fs.mkdir(paths.stateDir, {recursive: true});
  await fs.mkdir(paths.configStashDir, {recursive: true});
  await fs.mkdir(paths.originalsStashDir, {recursive: true});
}

export async function readState(): Promise<State> {
  try {
    const raw = await fs.readFile(paths.stateFile, 'utf-8');
    return JSON.parse(raw) as State;
  } catch {
    return {...EMPTY_STATE};
  }
}

export async function writeState(state: State): Promise<void> {
  await ensureStateDir();
  await fs.writeFile(paths.stateFile, JSON.stringify(state, null, 2) + '\n');
}

export async function addActivation(activation: Activation): Promise<void> {
  const state = await readState();
  state.activations.push(activation);
  await writeState(state);
}

export async function removeActivation(
  profileName: string,
  target: 'global' | 'project',
  projectPath?: string,
): Promise<Activation | null> {
  const state = await readState();
  const idx = state.activations.findIndex(
    a =>
      a.profile === profileName &&
      a.target === target &&
      a.projectPath === projectPath,
  );
  if (idx === -1) return null;
  const [removed] = state.activations.splice(idx, 1);
  await writeState(state);
  return removed;
}

export function getActivation(
  state: State,
  profileName: string,
): Activation | undefined {
  return state.activations.find(a => a.profile === profileName);
}

export function isActive(state: State, profileName: string): boolean {
  return state.activations.some(a => a.profile === profileName);
}

export function getActiveProfiles(state: State): string[] {
  return state.activations.map(a => a.profile);
}
