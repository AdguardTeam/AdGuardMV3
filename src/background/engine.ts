import * as TSUrlFilter from '@adguard/tsurlfilter';

import { log } from 'Common/logger';

import { RequestTypes } from './request-types';

// eslint-disable-next-line func-names
export const engine = (function () {
    const ASYNC_LOAD_CHUNK_SIZE = 5000;

    // eslint-disable-next-line @typescript-eslint/no-shadow
    let engine: any;

    const isReady = () => {
        return Boolean(engine);
    };

    const startEngine = async (lists:any) => {
        log.info('Starting url filter engine');
        engine = null;

        const ruleStorage = new TSUrlFilter.RuleStorage(lists);

        const config = {
            engine: 'extension',
            version: '0.0.1',
            verbose: true,
            compatibility: TSUrlFilter.CompatibilityTypes.extension,
        };

        TSUrlFilter.setConfiguration(config);

        const engineInstance = new TSUrlFilter.Engine(ruleStorage, true);

        await engineInstance.loadRulesAsync(ASYNC_LOAD_CHUNK_SIZE);

        engine = engineInstance;
        log.info('Starting url filter engine..ok');
    };

    const matchRequest = (matchQuery:any) => {
        const {
            requestUrl,
            frameUrl,
            requestType,
        } = matchQuery;

        let { frameRule } = matchQuery;

        if (!isReady()) {
            log.error('Filtering engine is not ready');
            return null;
        }

        if (!frameRule) {
            frameRule = null;
        }

        const request = new TSUrlFilter.Request(
            requestUrl,
            frameUrl,
            RequestTypes.transformRequestType(requestType),
        );

        const result = engine.matchRequest(request, frameRule);

        return result;
    };

    const getRulesCount = () => {
        return isReady() ? engine.getRulesCount() : 0;
    };

    return {
        startEngine,
        getRulesCount,
        matchRequest,
    };
}());
