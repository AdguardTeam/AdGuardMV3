import * as React from 'react';
import settingsStore from '../stores';

const App = () => {
    const store = React.useContext(settingsStore);
    return <h1 className="test--1">{store.settingsStore.currentTitle}</h1>;
};

export default App;
