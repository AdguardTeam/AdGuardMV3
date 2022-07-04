import { TsWebExtension, Configuration } from '@adguard/tswebextension/mv3';

import { filters } from './filters';
import { userRules } from './userRules';

class TsWebExtensionWrapper {
    private tsWebExtension: TsWebExtension;

    constructor() {
        this.tsWebExtension = new TsWebExtension('/web-accessible-resources/redirects');
    }

    async start() {
        const config = await this.getConfiguration();
        await this.tsWebExtension.start(config);
    }

    async stop() {
        await this.tsWebExtension.stop();
    }

    async configure() {
        const config = await this.getConfiguration();
        await this.tsWebExtension.configure(config);
    }

    private getConfiguration = async (): Promise<Configuration> => {
        const enabledFilters = await filters.getEnabledRules();

        return {
            settings: {
                allowlistEnabled: false,
                allowlistInverted: false,
                collectStats: true,
                // TODO: check fields needed in the mv3
                stealth: {
                    blockChromeClientData: false,
                    hideReferrer: false,
                    hideSearchQueries: false,
                    sendDoNotTrack: false,
                    blockWebRTC: false,
                    selfDestructThirdPartyCookies: false,
                    selfDestructThirdPartyCookiesTime: 0,
                    selfDestructFirstPartyCookies: false,
                    selfDestructFirstPartyCookiesTime: 0,
                },
            },
            filters: enabledFilters
                .map((r) => ({
                    filterId: r.id,
                    content: r.rules,
                })),
            allowlist: [],
            userrules: (await userRules.getRules()).split('\n'), // TODO: maybe getRules should return array instead of string
            verbose: true,
        };
    };

    getMessageHandler() {
        return this.tsWebExtension.getMessageHandler();
    }
}

export const tsWebExtensionWrapper = new TsWebExtensionWrapper();
