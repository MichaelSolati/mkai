import {Box, Text} from 'ink';
import React from 'react';

interface Props {
  message?: string;
  isError?: boolean;
  description?: string;
}

const KeyHelp = ({k, desc}: {k: string; desc: string}) => (
  <Box marginRight={2}>
    <Text color="cyan" bold>
      {k}
    </Text>
    <Text dimColor> {desc}</Text>
  </Box>
);

export const StatusLine = ({message, isError, description}: Props) => {
  return (
    <Box flexDirection="column" marginTop={1}>
      {/* Description area fixed at the bottom of the list */}
      <Box paddingX={1} minHeight={2}>
        {description && (
          <Text italic color="magenta">
            ✦ {description}
          </Text>
        )}
      </Box>

      <Box
        flexDirection="column"
        borderStyle="classic"
        borderColor="gray"
        paddingX={1}
        marginTop={1}
      >
        <Box flexDirection="row" flexWrap="wrap">
          <KeyHelp k="Enter" desc="Manage" />
          <KeyHelp k="s" desc="Details" />
          <KeyHelp k="h" desc="Health" />
          <KeyHelp k="q" desc="Quit" />
        </Box>

        {message && (
          <Box marginTop={1}>
            <Text color={isError ? 'red' : 'yellow'}>
              {isError ? '✖ ' : '▶ '}
              {message}
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};
