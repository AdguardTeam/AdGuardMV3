import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';

import { PopupApp } from './components/PopupApp';
import { log } from '../common/logger';

import '../common/styles/main.pcss';

try {
    ReactDOM.render(
        <Provider>
            <PopupApp />
        </Provider>,
        document.getElementById('root'),
    );
} catch (error) {
    log.error(error);
}
