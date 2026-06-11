import {Box, Text, useInput} from 'ink';
import React, {useState} from 'react';

import type {Platform, Profile, State} from '../types.js';

interface Props {
  profile: Profile;
  state: State;
  onToggle: (platform: Platform, target: 'global' | 'project') => void;
  onClose: () => void;
}

export const ToggleModal = ({profile, state, onToggle, onClose}: Props) => {
  const [cursor, setCursor] = useState(0);

  const options: Array<{
    label: string;
    platform: Platform;
    target: 'global' | 'project';
  }> = [
    {label: 'Claude Global', platform: 'claude', target: 'global'},
    {label: 'Claude Project', platform: 'claude', target: 'project'},
    {label: 'Gemini Global', platform: 'gemini', target: 'global'},
    {label: 'Gemini Project', platform: 'gemini', target: 'project'},
  ];

  useInput((input, key) => {
    if (key.escape || key.return) onClose();
    if (key.upArrow) setCursor(prev => Math.max(0, prev - 1));
    if (key.downArrow)
      setCursor(prev => Math.min(options.length - 1, prev + 1));
    if (input === ' ' || key.return) {
      const opt = options[cursor];
      onToggle(opt.platform, opt.target);
    }
  });

  return (
    <Box
      flexDirection="column"
      borderStyle="double"
      borderColor="cyan"
      paddingX={1}
      marginY={1}
    >
      <Text bold color="cyan">
        Configure: {profile.name}
      </Text>
      <Box flexDirection="column" marginTop={1}>
        {options.map((opt, i) => {
          const cwd = process.cwd();
          const isActive = state.activations.some(
            a =>
              a.profile === profile.name &&
              a.platform === opt.platform &&
              a.target === opt.target &&
              (opt.target === 'global' || a.projectPath === cwd),
          );
          const isSelected = i === cursor;

          return (
            <Box key={i}>
              <Text color={isSelected ? 'yellow' : undefined}>
                {isSelected ? '❯ ' : '  '}
                {isActive ? (
                  <Text color="green">◉ </Text>
                ) : (
                  <Text color="gray">○ </Text>
                )}
                {opt.label}
              </Text>
            </Box>
          );
        })}
      </Box>
      <Box marginTop={1}>
        <Text dimColor>[Space] Toggle | [Esc/Enter] Done</Text>
      </Box>
    </Box>
  );
};
