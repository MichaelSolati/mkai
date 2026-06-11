import {Box, Text} from 'ink';

import type {Activation} from '../types';

interface Props {
  activation?: Activation;
  onDone: () => void;
}

export const StatusDetails = ({activation}: Props) => {
  if (!activation) {
    return (
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor="blue"
        paddingX={1}
        marginTop={1}
      >
        <Text color="yellow">Profile is not active in any target.</Text>
        <Box marginTop={1}>
          <Text dimColor>Press [s] or [Esc] to return</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="blue"
      paddingX={1}
      marginTop={1}
    >
      <Text bold color="blue">
        Status: {activation.profile} [{activation.platform}] (
        {activation.target})
      </Text>
      <Box flexDirection="column" marginTop={1}>
        {activation.links.map((link, i) => (
          <Text key={i}>
            <Text dimColor>[{link.type}]</Text> {link.name}
            {link.overrode ? <Text color="yellow"> [overrode]</Text> : ''}
            {link.isGenerated ? <Text color="magenta"> [generated]</Text> : ''}
          </Text>
        ))}
      </Box>
      <Box marginTop={1}>
        <Text dimColor>Press [s] or [Esc] to return</Text>
      </Box>
    </Box>
  );
};
