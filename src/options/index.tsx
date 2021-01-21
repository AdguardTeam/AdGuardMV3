import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';

import { OptionsApp } from './components/OptionsApp';
import { log } from '../common/logger';

import '../common/styles/main.pcss';

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
