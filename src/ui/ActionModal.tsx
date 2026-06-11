import {Box, Text, useInput} from 'ink';
import {useState} from 'react';

import type {Platform, Profile} from '../types';

export interface ActionChoice {
  label: string;
  platform: Platform;
  target: 'global' | 'project';
  action: 'activate' | 'deactivate';
}

interface Props {
  profile: Profile;
  onSelect: (choice: ActionChoice) => void;
  onCancel: () => void;
}

export const ActionModal = ({profile, onSelect, onCancel}: Props) => {
  const [cursor, setCursor] = useState(0);

  const choices: ActionChoice[] = [
    {
      label: 'Activate (Claude Global)',
      platform: 'claude',
      target: 'global',
      action: 'activate',
    },
    {
      label: 'Activate (Claude Project)',
      platform: 'claude',
      target: 'project',
      action: 'activate',
    },
    {
      label: 'Activate (Gemini Global)',
      platform: 'gemini',
      target: 'global',
      action: 'activate',
    },
    {
      label: 'Activate (Gemini Project)',
      platform: 'gemini',
      target: 'project',
      action: 'activate',
    },
    {
      label: 'Deactivate (Claude Global)',
      platform: 'claude',
      target: 'global',
      action: 'deactivate',
    },
    {
      label: 'Deactivate (Claude Project)',
      platform: 'claude',
      target: 'project',
      action: 'deactivate',
    },
    {
      label: 'Deactivate (Gemini Global)',
      platform: 'gemini',
      target: 'global',
      action: 'deactivate',
    },
    {
      label: 'Deactivate (Gemini Project)',
      platform: 'gemini',
      target: 'project',
      action: 'deactivate',
    },
  ];

  useInput((input, key) => {
    if (key.escape) {
      onCancel();
    }
    if (key.upArrow) {
      setCursor(prev => Math.max(0, prev - 1));
    }
    if (key.downArrow) {
      setCursor(prev => Math.min(choices.length - 1, prev + 1));
    }
    if (key.return) {
      onSelect(choices[cursor]);
    }
  });

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="yellow"
      paddingX={1}
      marginTop={1}
    >
      <Text bold>Action for {profile.name}:</Text>
      {choices.map((choice, index) => (
        <Text key={index} color={index === cursor ? 'yellow' : undefined}>
          {index === cursor ? '→ ' : '  '}
          {choice.label}
        </Text>
      ))}
      <Box marginTop={1}>
        <Text dimColor>[Esc] Cancel</Text>
      </Box>
    </Box>
  );
};
