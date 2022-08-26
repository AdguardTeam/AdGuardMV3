import React, { useState, useContext } from 'react';
import cn from 'classnames';

import { reactTranslator } from 'Common/translators/reactTranslator';
import { FiltersGroupId, FilterInfo } from 'Common/constants/common';
import { log } from 'Common/logger';
import { theme } from 'Common/styles';
import { translator } from 'Common/translators/translator';
import { IconId } from 'Common/components/ui';
import { rootStore } from 'Options/stores';
import { sender } from 'Options/messaging/sender';

const readFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result as string);
        };

        reader.onerror = (ev: ProgressEvent<FileReader>) => reject(ev);

        reader.readAsText(file);
    });
};

type AddCustomProps = {
    onError: (error: string) => void,
    onSuccess: (filterInfo: FilterInfo, fileContent: string) => void,
    addCustomFilterError: string,
    urlToSubscribe: string,
    setUrlToSubscribe: (url: string) => void,
    initialTitle: string | null,
};

export const AddCustomFilter = ({
    onError,
    onSuccess,
    addCustomFilterError,
    urlToSubscribe,
    initialTitle,
    setUrlToSubscribe,
}: AddCustomProps) => {
    const { settingsStore, uiStore } = useContext(rootStore);
    const { filters } = settingsStore;
    const [textareaValue, setTextareaValue] = useState(urlToSubscribe);

    const ERROR_FORMAT_IS_BROKEN = translator.getMessage('options_custom_filter_modal_retry_description');
    // TODO error text for popup is not approved
    const ERROR_URL_ALREADY_UPLOADED = translator.getMessage('options_custom_filter_modal_url_already_uploaded');

    const filtersUrls = filters
        .filter((filter) => filter.groupId === FiltersGroupId.CUSTOM)
        .map((filter) => filter.url);

    const handleTextareaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setTextareaValue(value);
    };

    // Adds filter by file content
    const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            log.error('No files provided');
            return;
        }

        const [file] = e.target.files;

        // clear input to track consequent file uploads
        e.target.value = '';

        try {
            const isCorrectExtension = file.name.endsWith('.txt');
            if (!isCorrectExtension) {
                const message = translator.getMessage('options_custom_filter_modal_incorrect_format');
                uiStore.addNotification(message, IconId.WARNING);
                throw new Error(message);
            }
            const fileContent = await readFile(file);
            const filterInfo = await sender.getFilterInfoByContent(fileContent,
                initialTitle || file.name);
            if (!filterInfo) {
                throw new Error('failed to get filterInfo');
            }
            onSuccess(filterInfo, fileContent);
        } catch (error: any) {
            log.error(`${ERROR_FORMAT_IS_BROKEN} ${error.message}`);
            onError(ERROR_FORMAT_IS_BROKEN);
        }
    };

    // Adds filter by url
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const url = data.get('url') as string;
        if (filtersUrls.includes(url)) {
            onError(ERROR_URL_ALREADY_UPLOADED);
        }
        if (!url.endsWith('.txt')) {
            const message = translator.getMessage('options_custom_filter_modal_incorrect_format');
            uiStore.addNotification(message, IconId.WARNING);
            onError(ERROR_FORMAT_IS_BROKEN);
        }
        setUrlToSubscribe(url);
        try {
            const filterContent = await sender.getFilterContentByUrl(url);
            const filterInfo = await sender.getFilterInfoByContent(filterContent,
                initialTitle || url);
            if (!filterInfo) {
                log.error(ERROR_FORMAT_IS_BROKEN);
                onError(ERROR_FORMAT_IS_BROKEN);
            }
            onSuccess(filterInfo, filterContent);
        } catch (error: any) {
            const message = translator.getMessage('options_custom_filter_modal_incorrect_url');
            uiStore.addNotification(message, IconId.WARNING);
            log.error(`${ERROR_FORMAT_IS_BROKEN} ${error.message}`);
            onError(ERROR_FORMAT_IS_BROKEN);
        }
    };

    if (addCustomFilterError) {
        return (
            <>
                <div className={theme.modal.description}>
                    {addCustomFilterError}
                </div>
                <div className={theme.modal.footer}>
                    <button
                        type="button"
                        className={cn(theme.button.middle, theme.button.green)}
                        onClick={() => { onError(''); }}
                    >
                        {reactTranslator.getMessage('options_custom_filter_modal_retry_button')}
                    </button>
                </div>
            </>
        );
    }

    return (
        <form action="#" onSubmit={handleSubmit}>
            <div className={theme.modal.itemWrapper}>
                <div className={theme.modal.label}>
                    {reactTranslator.getMessage('options_paste_filter_label')}
                </div>
                <input
                    // Disable autofocus if the popup opens after subscribing to a filter,
                    // the text in the input may not be displayed correctly
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus={textareaValue.trim().length === 0}
                    autoComplete="off"
                    type="text"
                    className={theme.modal.modalInput}
                    defaultValue={textareaValue}
                    onChange={handleTextareaChange}
                    name="url"
                    placeholder={translator.getMessage('options_paste_filter_url')}
                />
            </div>
            <input
                id="file-input"
                type="file"
                accept=".txt"
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
            />
            <div className={theme.modal.footer}>
                <button
                    type="submit"
                    disabled={textareaValue.trim().length === 0}
                    className={cn(theme.button.middle, theme.button.green, theme.modal.leftBtn)}
                >
                    {reactTranslator.getMessage('options_custom_filter_modal_add_add_button')}
                </button>
                <button
                    type="button"
                    className={cn(theme.button.middle, theme.button.transparent)}
                    disabled={textareaValue.trim().length > 0}
                >
                    <label htmlFor="file-input">
                        {reactTranslator.getMessage('options_custom_filter_modal_add_browse_button')}
                    </label>
                </button>
            </div>
        </form>
    );
};
