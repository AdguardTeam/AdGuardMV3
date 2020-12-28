import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';

import { App } from './components/App';
import { log } from '../common/logger';

import '../common/styles/main.pcss';

try {
    ReactDOM.render(
        <Provider>
            <App />
        </Provider>,
        document.getElementById('root'),
    );
} catch (error) {
    log.error(error);
}
