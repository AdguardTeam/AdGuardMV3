import React, { useContext } from 'react';
import { observer } from 'mobx-react';

import { rootStore } from 'Popup/stores';
import { Loader } from 'Common/components/Loader';

export const LoaderOverlay = observer(() => {
    const { settingsStore: { loader } } = useContext(rootStore);

    if (loader) {
        return <Loader />;
    }

    return null;
});
