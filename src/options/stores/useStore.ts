import { useContext } from 'react';

import { rootStore } from 'Options/stores';

export const useStore = () => {
    return useContext(rootStore);
};
