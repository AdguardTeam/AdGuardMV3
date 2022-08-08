import { useLayoutEffect, useState } from 'react';

export const WithTimeout = ({
    children,
    dummy,
    timeoutMS,
} : { children: JSX.Element, dummy: JSX.Element, timeoutMS: number }) => {
    const [timeoutPass, setTimeoutPass] = useState(false);

    useLayoutEffect(() => {
        setTimeout(() => {
            setTimeoutPass(true);
        }, timeoutMS);
    }, []);

    return timeoutPass ? children : dummy;
};
