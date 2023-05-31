import React from 'react';
import { createRoot } from 'react-dom/client';

import { log } from 'Common/logger';

import { DebuggingInfo } from './DebuggingInfo';

try {
    const rootNode = document.getElementById('root')!;
    const root = createRoot(rootNode);
    root.render(
        <DebuggingInfo />,
    );
} catch (error) {
    log.error(error);
}
