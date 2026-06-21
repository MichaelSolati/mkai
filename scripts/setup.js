#!/usr/bin/env node
// Runs after `npm install`. Creates ~/.mkai as a symlink to the package root
// so all skill files, scripts, and profiles are accessible via stable absolute paths.
//
// Works for `npm link` (dev), `npm install -g` (global), and any other install method
// because PKG_DIR is resolved from this script's own location, not process.cwd().

import {fileURLToPath} from 'url';
import path from 'path';
import fs from 'fs';
import os from 'os';

const PKG_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const PKG_DATA = path.join(PKG_DIR, '.data');
const MKAI_LINK = path.join(os.homedir(), '.mkai');

// Ensure the runtime data dir exists inside the package
fs.mkdirSync(path.join(PKG_DATA, 'stash', 'configs'), {recursive: true});
fs.mkdirSync(path.join(PKG_DATA, 'stash', 'originals'), {recursive: true});

// Migrate state.json and stash from the old ~/.mkai real directory if needed
try {
  const stat = fs.lstatSync(MKAI_LINK);
  if (!stat.isSymbolicLink()) {
    const oldState = path.join(MKAI_LINK, 'state.json');
    const newState = path.join(PKG_DATA, 'state.json');
    if (fs.existsSync(oldState) && !fs.existsSync(newState)) {
      fs.copyFileSync(oldState, newState);
      console.log('mkai: migrated state.json to package data dir');
    }
    const oldStash = path.join(MKAI_LINK, 'stash');
    if (fs.existsSync(oldStash)) {
      fs.cpSync(oldStash, path.join(PKG_DATA, 'stash'), {
        recursive: true,
        force: false,
      });
      console.log('mkai: migrated stash to package data dir');
    }
    fs.rmSync(MKAI_LINK, {recursive: true, force: true});
  } else {
    // Already a symlink — remove it so we can re-point it
    fs.unlinkSync(MKAI_LINK);
  }
} catch {
  // ~/.mkai doesn't exist yet — nothing to migrate
}

fs.symlinkSync(PKG_DIR, MKAI_LINK);
console.log(`mkai: ~/.mkai → ${PKG_DIR}`);
