import {Box, Text, useApp, useInput} from 'ink';
import React, {useEffect, useState} from 'react';

import {activateProfile} from '../activate.js';
import {deactivateProfile} from '../deactivate.js';
import {discoverProfiles} from '../profile.js';
import {readState} from '../state.js';
import type {Platform, Profile, State, Target} from '../types.js';
import {HealthCheck} from './HealthCheck.js';
import {ProfileList} from './ProfileList.js';
import {StatusDetails} from './StatusDetails.js';
import {StatusLine} from './StatusLine.js';
import {ToggleModal} from './ToggleModal.js';

export const App = () => {
  const {exit} = useApp();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [state, setState] = useState<State | null>(null);
  const [cursor, setCursor] = useState(0);
  const [view, setView] = useState<
    'dashboard' | 'health' | 'status' | 'manage'
  >('dashboard');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const fetchData = async () => {
    const [p, s] = await Promise.all([discoverProfiles(), readState()]);
    setProfiles(p);
    setState(s);
  };

  useEffect(() => {
    void fetchData();
  }, []);

  const handleToggle = async (
    platform: Platform,
    targetKind: 'global' | 'project',
  ) => {
    if (!state) return;
    const profile = profiles[cursor];
    const cwd = process.cwd();
    const existing = state.activations.find(
      a =>
        a.profile === profile.name &&
        a.platform === platform &&
        a.target === targetKind &&
        (targetKind === 'global' || a.projectPath === cwd),
    );

    setMessage(
      `${existing ? 'Deactivating' : 'Activating'} ${profile.name}...`,
    );
    setIsError(false);

    try {
      const target: Target =
        targetKind === 'project'
          ? {kind: 'project', projectPath: cwd, platform}
          : {kind: 'global', platform};

      if (existing) {
        await deactivateProfile(profile.name, target);
        setMessage(`Deactivated ${profile.name} (${platform} ${targetKind})`);
      } else {
        const result = await activateProfile(profile, target, {force: true});
        if (result.success) {
          setMessage(`Activated ${profile.name} (${platform} ${targetKind})`);
        } else {
          setIsError(true);
          setMessage(`Failed: ${result.errors[0]}`);
        }
      }
      await fetchData();
    } catch (err) {
      setIsError(true);
      setMessage(`Error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  useInput((input, key) => {
    if (view !== 'dashboard') {
      if (key.escape) setView('dashboard');
      return;
    }

    if (key.upArrow) setCursor(prev => Math.max(0, prev - 1));
    if (key.downArrow)
      setCursor(prev => Math.min(profiles.length - 1, prev + 1));

    if (key.return) setView('manage');
    if (input === 'h') setView('health');
    if (input === 's') setView('status');
    if (input === 'q') exit();
  });

  if (!state) {
    return (
      <Box padding={1}>
        <Text color="yellow">✦ Initializing CPX...</Text>
      </Box>
    );
  }

  return (
    <Box
      flexDirection="column"
      padding={1}
      borderStyle="round"
      borderColor="magenta"
    >
      <Box marginBottom={1} justifyContent="center">
        <Text bold color="magenta">
          ☄ CPX COMMAND CENTER ☄
        </Text>
      </Box>

      {view === 'dashboard' || view === 'manage' ? (
        <ProfileList profiles={profiles} state={state} cursor={cursor} />
      ) : null}

      {view === 'manage' && (
        <ToggleModal
          profile={profiles[cursor]}
          state={state}
          onToggle={handleToggle}
          onClose={() => setView('dashboard')}
        />
      )}

      {view === 'health' && (
        <HealthCheck state={state} onDone={() => setView('dashboard')} />
      )}

      {view === 'status' && (
        <StatusDetails
          activation={state.activations.find(
            a =>
              a.profile === profiles[cursor].name &&
              (a.target === 'global' || a.projectPath === process.cwd()),
          )}
          onDone={() => setView('dashboard')}
        />
      )}

      <StatusLine
        message={message}
        isError={isError}
        description={
          view === 'dashboard' || view === 'manage'
            ? profiles[cursor]?.description
            : undefined
        }
      />
    </Box>
  );
};
