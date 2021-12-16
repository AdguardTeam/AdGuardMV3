import React, { useState } from 'react';
import cn from 'classnames';

import { reactTranslator } from 'Common/translators/reactTranslator';
import { log } from 'Common/logger';
import { theme } from 'Common/styles';
import { translator } from 'Common/translators/translator';
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
    onError: (error: string | boolean) => void,
    onSuccess: (filterInfo: FilterInfo, fileContent: string) => void,
    addCustomFilterError: boolean,
    urlToSubscribe: string,
    initialTitle: string | null,
};

export const AddCustomFilter = ({
    onError,
    onSuccess,
    addCustomFilterError,
    urlToSubscribe,
    initialTitle,
}: AddCustomProps) => {
    const [textareaValue, setTextareaValue] = useState(urlToSubscribe);

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
                const errorMessage = 'Filter format is broken';
                log.error(errorMessage);
                onError(errorMessage);
            }
            onSuccess(filterInfo, fileContent);
        } catch (error: any) {
            const errorMessage = `Filter format is broken, ${error.message}`;
            log.error(errorMessage);
            onError(errorMessage);
        }
    };

    // Adds filter by url
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const url = data.get('url') as string;
        try {
            const filterContent = await sender.getFilterContentByUrl(url);
            const filterInfo = await sender.getFilterInfoByContent(filterContent,
                initialTitle || url);
            if (!filterInfo) {
                const errorMessage = 'Filter format is broken';
                log.error(errorMessage);
                onError(errorMessage);
            }
            onSuccess(filterInfo, filterContent);
        } catch (error: any) {
            const errorMessage = `Filter format is broken, ${error.message}`;
            log.error(errorMessage);
            onError(errorMessage);
        }
    };

    if (addCustomFilterError) {
        return (
            <>
                <div className={theme.modal.description}>
                    {reactTranslator.getMessage('options_custom_filter_modal_retry_description')}
                </div>
                <div className={cn(theme.modal.footer, theme.modal.center)}>
                    <button
                        type="button"
                        className={cn(theme.button.middle, theme.button.green)}
                        onClick={() => { onError(false); }}
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
                <button type="button" className={cn(theme.button.middle, theme.button.transparent, theme.modal.leftBtn)}>
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
