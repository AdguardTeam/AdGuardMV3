import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'mobx-react';

import { log } from 'Common/logger';

import { PopupApp } from './components/PopupApp';

import 'Common/styles/main.pcss';

try {
    const node = document.getElementById('root')!;
    const root = createRoot(node);
    root.render(
        <Provider>
            <PopupApp />
        </Provider>,
    );
} catch (error) {
    log.error(error);
}
