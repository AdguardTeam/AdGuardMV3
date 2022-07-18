import React, { useContext } from 'react';
import { observer } from 'mobx-react';

import { rootStore } from 'Options/stores';
import { Loader } from 'Common/components/Loader';

export const LoaderOverlay = observer(() => {
    const { uiStore: { loader } } = useContext(rootStore);

    if (loader) {
        return <Loader />;
    }

    return null;
});
