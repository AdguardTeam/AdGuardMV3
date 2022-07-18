import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';

import { log } from 'Common/logger';

import { OptionsApp } from './components/OptionsApp';

import 'Common/styles/main.pcss';

try {
    ReactDOM.render(
        <Provider>
            <OptionsApp />
        </Provider>,
        document.getElementById('root'),
    );
} catch (error) {
    log.error(error);
}
