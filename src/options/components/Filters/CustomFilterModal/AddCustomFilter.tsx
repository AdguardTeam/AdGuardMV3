import React, { useState, useContext } from 'react';
import cn from 'classnames';

import { reactTranslator } from 'Common/translators/reactTranslator';
import { FiltersGroupId, FilterInfo } from 'Common/constants/common';
import { log } from 'Common/logger';
import { theme } from 'Common/styles';
import { translator } from 'Common/translators/translator';
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
    const { settingsStore } = useContext(rootStore);
    const { filters } = settingsStore;
    const [textareaValue, setTextareaValue] = useState(urlToSubscribe);

    const ERROR_FORMAT_IS_BROKEN = translator.getMessage('options_custom_filter_modal_retry_description');
    // TODO error text for popup is not approved
    const ERROR_URL_ALREADY_UPLOADED = translator.getMessage('options_custom_filter_modal_url_already_uploaded');

    const filtersUrls = filters
        .filter((filter) => filter.groupId === FiltersGroupId.CUSTOM)
        .map((filter) => filter.url);

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
            const fileContent = await readFile(file);
            const filterInfo = await sender.getFilterInfoByContent(fileContent,
                initialTitle || file.name);
            if (!filterInfo) {
                log.error(ERROR_FORMAT_IS_BROKEN);
                onError(ERROR_FORMAT_IS_BROKEN);
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
                <div className={cn(theme.modal.footer, theme.modal.center)}>
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
            <textarea
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                className={cn(theme.modal.modalInput, theme.modal.modalTextarea)}
                defaultValue={textareaValue}
                onChange={handleTextareaChange}
                name="url"
                placeholder={translator.getMessage('options_paste_filter_url')}
            />
            <input
                id="file-input"
                type="file"
                accept=".txt"
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
            />
            <div className={theme.modal.footer}>
                <button
                    type="button"
                    className={cn(theme.button.middle, theme.button.transparent, theme.modal.leftBtn)}
                >
                    <label htmlFor="file-input">
                        {reactTranslator.getMessage('options_custom_filter_modal_add_browse_button')}
                    </label>
                </button>
                <button
                    type="submit"
                    disabled={textareaValue.trim().length === 0}
                    className={cn(theme.button.middle, theme.button.green)}
                >
                    {reactTranslator.getMessage('options_custom_filter_modal_add_add_button')}
                </button>
            </div>
        </form>
    );
};
