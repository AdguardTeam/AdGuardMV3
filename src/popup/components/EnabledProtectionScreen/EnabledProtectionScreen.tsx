import React from 'react';

import { PageInfo } from '../PageInfo';
import { Switcher } from '../Switcher';

export const EnabledProtectionScreen = () => {
    return (
        <>
            <PageInfo />
            <Switcher />
            {/* TODO: count blocked on the page */}
            {/* <Action /> */}
        </>
    );
};
