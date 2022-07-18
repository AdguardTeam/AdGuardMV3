import React from 'react';
import ReactDOM from 'react-dom';

import { log } from 'Common/logger';

import { DebuggingInfo } from './DebuggingInfo';

try {
    ReactDOM.render(
        <DebuggingInfo />,
        document.getElementById('root'),
    );
} catch (error) {
    log.error(error);
}
