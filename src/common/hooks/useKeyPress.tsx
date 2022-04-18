import { useEffect } from 'react';

export const useKeyPress = (key: string, callback: () => void, deps?: any[]) => {
    useEffect(() => {
        const onKeyPress = (e: KeyboardEvent) => {
            if (e.key === key) {
                callback();
            }
        };
        window.addEventListener('keyup', onKeyPress);
        return () => {
            window.removeEventListener('keyup', onKeyPress);
        };
    }, deps ? [...deps] : []);
};
