/* eslint-disable no-restricted-globals */
import { Configuration, ConfigurationResult } from '@adguard/tswebextension/mv3';

import { type TestDetails } from './logger';

declare global {
    interface Window {
        adguard: {
            configure: (config: Configuration) => Promise<ConfigurationResult>;
        }
    }
}

export const addQunitListeners = () => {
    let qUnit: any;

    Object.defineProperty(window, 'QUnit', {
        get: () => qUnit,
        set: (value) => {
            qUnit = value;

            // https://api.qunitjs.com/callbacks/QUnit.on/#the-runend-event
            qUnit.on('runEnd', (details: TestDetails) => {
                const name = document.getElementById('qunit-header')?.textContent;

                const testDetails = Object.assign(details, { name });

                (<any>window).testDetails = testDetails;
            });
        },
        configurable: true,
    });
};

export type SetTsWebExtensionConfigArg = [ defaultConfig: Configuration, userrules: string ];

export const setTsWebExtensionConfig = async (arg: SetTsWebExtensionConfigArg) => {
    if (!self.adguard) {
        throw new Error(`self.adguard is not found in Window object: ${JSON.stringify(self)}`);
    }
    const [defaultConfig, userrules] = arg;
    const configuration: Configuration = defaultConfig;
    configuration.userrules = userrules.split('\n');
    await self.adguard.configure(configuration);
};

export const waitUntilExtensionInitialized = async (eventName: string): Promise<void> => {
    return new Promise((resolve: () => void) => {
        addEventListener(eventName, resolve, { once: true });
    });
};
