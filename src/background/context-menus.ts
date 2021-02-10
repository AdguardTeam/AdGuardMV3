import { defaults } from 'lodash';

/**
 * Wrapper for contextMenus api methods
 *
 * API description - https://developer.chrome.com/docs/extensions/reference/contextMenus
 */
class ContextMenus {
    /**
     * Creates context menu item
     * @param createProps
     */
    create = (createProps: chrome.contextMenus.CreateProperties) => {
        const DEFAULT_CREATE_PROPS = {
            /**
             * https://developer.chrome.com/docs/extensions/reference/contextMenus/#type-ContextType
             */
            contexts: ['page', 'frame', 'selection', 'link', 'editable', 'image', 'video', 'audio'],
        };

        // eslint-disable-next-line no-param-reassign
        createProps = defaults(createProps, DEFAULT_CREATE_PROPS);

        return new Promise<void>(
            (resolve, reject) => {
                chrome.contextMenus.create(createProps, () => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    }
                    resolve();
                });
            },
        );
    };

    /**
     * Removes all context menu items
     */
    removeAll = () => new Promise<void>((resolve, reject) => {
        chrome.contextMenus.removeAll(() => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
            }
            resolve();
        });
    });
}

export const contextMenus = new ContextMenus();
