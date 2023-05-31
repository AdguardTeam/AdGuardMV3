import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'mobx-react';

import { log } from 'Common/logger';

import { OptionsApp } from './components/OptionsApp';

import 'Common/styles/main.pcss';

try {
    const root = createRoot(document.getElementById('root')!);
    root.render(
        <Provider>
            <OptionsApp />
        </Provider>,
    );
} catch (error) {
    log.error(error);
}
