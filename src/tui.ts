import {render} from 'ink';
import React from 'react';

import {App} from './ui/App';

export async function runTui(): Promise<void> {
  const {waitUntilExit} = render(React.createElement(App));
  await waitUntilExit();
}
