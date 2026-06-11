import {Box, Text} from 'ink';
import React from 'react';

import type {Profile, State} from '../types.js';

interface Props {
  profiles: Profile[];
  state: State;
  cursor: number;
}

const Indicator = ({active}: {active: boolean}) => (
  <Text color={active ? 'cyan' : 'gray'}>{active ? '◉' : '○'}</Text>
);

export const ProfileList = ({profiles, state, cursor}: Props) => {
  return (
    <Box flexDirection="column" paddingX={1}>
      <Box
        marginBottom={1}
        borderStyle="single"
        borderBottom={true}
        borderTop={false}
        borderLeft={false}
        borderRight={false}
        borderColor="gray"
      >
        <Box width={30}>
          <Text bold color="magenta">
            PROFILE
          </Text>
        </Box>
        <Box width={10} justifyContent="center">
          <Text bold color="cyan">
            CLAUDE
          </Text>
        </Box>
        <Box width={10} justifyContent="center">
          <Text bold color="cyan">
            GEMINI
          </Text>
        </Box>
      </Box>

      {profiles.map((profile, index) => {
        const isSelected = index === cursor;
        const cwd = process.cwd();

        const hasClaude = state.activations.some(
          a =>
            a.profile === profile.name &&
            a.platform === 'claude' &&
            (a.target === 'global' || a.projectPath === cwd),
        );
        const hasGemini = state.activations.some(
          a =>
            a.profile === profile.name &&
            a.platform === 'gemini' &&
            (a.target === 'global' || a.projectPath === cwd),
        );

        return (
          <Box key={profile.name} flexDirection="column" marginBottom={0}>
            <Box>
              <Box width={30}>
                <Text
                  color={isSelected ? 'yellow' : undefined}
                  bold={isSelected}
                >
                  {isSelected ? '❯ ' : '  '}
                  {profile.name}
                </Text>
              </Box>

              <Box width={10} justifyContent="center">
                <Indicator active={hasClaude} />
              </Box>

              <Box width={10} justifyContent="center">
                <Indicator active={hasGemini} />
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
