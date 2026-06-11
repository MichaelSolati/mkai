export type Platform = 'claude' | 'gemini';

export interface ProfileYaml {
  name: string;
  description: string;
  tags: string[];
  agents: string[];
  commands: string[];
  skills: string[];
  hooks: string[];
  requires: string[];
  conflicts: string[];
}

export interface Profile extends ProfileYaml {
  path: string;
}

export interface State {
  version: 1;
  profilesRepo: string;
  activations: Activation[];
}

export interface Activation {
  profile: string;
  platform: Platform;
  target: 'global' | 'project';
  projectPath?: string;
  activatedAt: string;
  links: LinkRecord[];
}

export interface LinkRecord {
  type: 'agent' | 'command' | 'skill';
  name: string;
  source: string;
  destination: string;
  overrode: string | null;
  isGenerated?: boolean;
}

export interface Conflict {
  type: 'agent' | 'command' | 'skill';
  name: string;
  destination: string;
  kind:
    | 'real-file'
    | 'symlink-other-profile'
    | 'symlink-same-profile'
    | 'broken-symlink';
  ownedByProfile?: string;
}

export interface StashRecord {
  originalPath: string;
  stashPath: string;
  profile: string;
  type: 'agent' | 'command' | 'skill';
}

export type Target =
  | {kind: 'global'; platform: Platform}
  | {kind: 'project'; projectPath: string; platform: Platform};
