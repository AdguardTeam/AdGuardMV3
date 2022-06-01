import { TsWebExtension, Configuration, MessageType } from '@adguard/tswebextension/mv3';
import { MESSAGE_HANDLER_NAME } from '@adguard/tswebextension';
import { Message } from '../message';
import { StorageKeys, storage } from './storage';
import { loadFilterContent } from './loadFilterContent';
import { loadDefaultConfig } from './loadDefaultConfig';

declare global {
    interface Window {
        tsWebExtension: TsWebExtension;
    }
}

const tsWebExtension = new TsWebExtension('/war/redirects');
// Need to access tsWebExtension on check test-cases
// eslint-disable-next-line no-restricted-globals
self.tsWebExtension = tsWebExtension;
const defaultUxConfig = {
    isStarted: true,
};
const filtersDir = 'filters';

interface IMessage {
    type: Message,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any,
}

interface IMessageInner {
    type: MessageType,
    handlerName: typeof MESSAGE_HANDLER_NAME,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload?: any,
}

let config: Configuration;
let isStarted: boolean;
let waitingConfigAndStart: Promise<void>;

export const tsWebExtensionMessageHandler = tsWebExtension.getMessageHandler();

// eslint-disable-next-line consistent-return
const messageHandler = async (message: IMessage): Promise<any> => {
    const { type, data } = message;
    switch (type) {
        case Message.GET_CONFIG: {
            return {
                status: isStarted,
                filters: config.filters.map((f) => f.filterId),
                rules: config.userrules,
            };
        }
        case Message.UPDATE_FILTERS: {
            const filterIds = data as number[];

            const currentFiltersIds = config.filters.map((f) => f.filterId);
            const filtersToLoad = filterIds
                .filter((id) => !currentFiltersIds.includes(id))
                .map((id) => loadFilterContent(id, filtersDir));
            const loadedFilters = await Promise.all(filtersToLoad);
            const filtersToStay = config.filters.filter((f) => filterIds.includes(f.filterId));

            config.filters = filtersToStay.concat(loadedFilters);

            await tsWebExtension.configure(config);

            await storage.set(StorageKeys.CONFIG, config);

            break;
        }
        case Message.TURN_OFF: {
            try {
                await tsWebExtension.stop();
                isStarted = false;
            } catch (e: any) {
                console.log(e.message);
            }

            await storage.set(StorageKeys.IS_STARTED, isStarted);

            return isStarted;
        }
        case Message.TURN_ON: {
            try {
                await tsWebExtension.start(config);
                isStarted = true;
            } catch (e: any) {
                console.log(e.message);
            }

            await storage.set(StorageKeys.IS_STARTED, isStarted);

            return isStarted;
        }
        case Message.APPLY_USER_RULES: {
            config.userrules = (data as string).split('\n');

            await tsWebExtension.configure(config);

            await storage.set(StorageKeys.CONFIG, config);

            break;
        }
        default: {
            break;
        }
    }
};

const startIfNeed = async () => {
    if (isStarted === undefined) {
        const savedValue = await storage.get<boolean>(StorageKeys.IS_STARTED);

        isStarted = savedValue !== undefined
            ? savedValue
            : defaultUxConfig.isStarted;
    }

    if (isStarted) {
        await tsWebExtension.start(config);
    }
};

export const checkConfigAndStart = async () => {
    if (waitingConfigAndStart) {
        await waitingConfigAndStart;

        return;
    }

    if (config === undefined) {
        const savedConfig = await storage.get<Configuration>(StorageKeys.CONFIG);
        if (savedConfig) {
            config = savedConfig;
        } else {
            config = await loadDefaultConfig(filtersDir);
            storage.set(StorageKeys.CONFIG, config);
        }
    }

    await startIfNeed();
};

const proxyHandler = async (
    message: IMessage | IMessageInner,
    sender: chrome.runtime.MessageSender,
) => {
    const id = `id_${Math.random().toString(16).slice(2)}`;
    console.debug('[PROXY HANDLER]: start check config', id, message);

    await checkConfigAndStart();

    console.debug('[PROXY HANDLER]: after check config ', id, message);

    if ((message as IMessageInner)?.handlerName === 'tsWebExtension') {
        return tsWebExtensionMessageHandler(message as IMessageInner, sender);
    }
    return messageHandler(message as IMessage);
};

// TODO: Add same logic for update event
chrome.runtime.onInstalled.addListener(async () => {
    console.debug('[ON INSTALLED]: start');

    await checkConfigAndStart();

    console.debug('[ON INSTALLED]: done');
});

chrome.runtime.onMessage
    .addListener((
        message: IMessage | IMessageInner,
        sender: chrome.runtime.MessageSender,
        sendResponse,
    ) => {
        console.debug('[ON MESSAGE]: ', message);

        proxyHandler(message, sender).then(sendResponse);

        return true;
    });
