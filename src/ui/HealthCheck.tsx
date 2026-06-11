import {Box, Text} from 'ink';
import {useEffect, useState} from 'react';

import {exists, isHealthySymlink} from '../symlink';
import type {State} from '../types';

interface Props {
  state: State;
  onDone: () => void;
}

interface BrokenLink {
  profile: string;
  name: string;
  destination: string;
}

export const HealthCheck = ({state}: Props) => {
  const [broken, setBroken] = useState<BrokenLink[]>([]);
  const [total, setTotal] = useState(0);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const runCheck = async () => {
      let totalCount = 0;
      const brokenList: BrokenLink[] = [];

      for (const activation of state.activations) {
        for (const link of activation.links) {
          totalCount++;
          const healthy = link.isGenerated
            ? await exists(link.destination)
            : await isHealthySymlink(link.destination);

          if (!healthy) {
            brokenList.push({
              profile: activation.profile,
              name: link.name,
              destination: link.destination,
            });
          }
        }
      }
      setTotal(totalCount);
      setBroken(brokenList);
      setChecking(false);
    };

    void runCheck();
  }, [state]);

  if (checking) {
    return <Text color="yellow">Checking symlink health...</Text>;
  }

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="cyan"
      paddingX={1}
      marginTop={1}
    >
      <Text bold color="cyan">
        Health Check Results
      </Text>
      <Text>Total links checked: {total}</Text>
      {broken.length === 0 ? (
        <Text color="green">All symlinks are healthy!</Text>
      ) : (
        <>
          <Text color="red">{broken.length} broken links found:</Text>
          {broken.map((b, i) => (
            <Text key={i} color="red">
              - {b.profile}/{b.name} {'->'} {b.destination}
            </Text>
          ))}
        </>
      )}
      <Box marginTop={1}>
        <Text dimColor>Press [c] or [Esc] to return</Text>
      </Box>
    </Box>
  );
};
