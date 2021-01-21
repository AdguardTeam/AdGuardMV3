import { createContext } from 'react';
import { configure } from 'mobx';

import { RootStore } from './RootStore';

// Do not allow property change outside of store actions
configure({ enforceActions: 'observed' });

export const rootStore = createContext(new RootStore());
