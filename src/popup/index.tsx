import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';

import { log } from 'Common/logger';

import { PopupApp } from './components/PopupApp';

import 'Common/styles/main.pcss';

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
