import React from 'react';
import ReactDOM from 'react-dom';

import { log } from 'Common/logger';
import { DebuggingApp } from './DebuggingApp';

try {
    ReactDOM.render(
        <DebuggingApp />,
        document.getElementById('root'),
    );
} catch (error) {
    log.error(error);
}
