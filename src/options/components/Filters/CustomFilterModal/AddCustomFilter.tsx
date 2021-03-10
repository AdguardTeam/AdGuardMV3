import React, { useState } from 'react';

import { reactTranslator } from 'Common/translators/reactTranslator';
import { log } from 'Common/logger';
import { sender } from '../../../messaging/sender';

import styles from './CustomFilterModal.module.pcss';

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
};

export const AddCustomFilter = ({ onError, onSuccess }: AddCustomProps) => {
    const [textareaValue, setTextareaValue] = useState('');

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
            const fileContent = await readFile(file);
            const filterInfo = await sender.getFilterInfoByContent(fileContent, file.name);
            if (!filterInfo) {
                const errorMessage = 'Filter format is broken';
                log.error(errorMessage);
                onError(errorMessage);
            }
            onSuccess(filterInfo, fileContent);
        } catch (ex) {
            const errorMessage = `Filter format is broken, ${ex.message}`;
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
            const filterInfo = await sender.getFilterInfoByContent(filterContent, url);
            if (!filterInfo) {
                const errorMessage = 'Filter format is broken';
                log.error(errorMessage);
                onError(errorMessage);
            }
            onSuccess(filterInfo, filterContent);
        } catch (ex) {
            const errorMessage = `Filter format is broken, ${ex.message}`;
            log.error(errorMessage);
            onError(errorMessage);
        }
    };

    return (
        <form action="#" onSubmit={handleSubmit}>
            <input
                type="textarea"
                defaultValue={textareaValue}
                onChange={handleTextareaChange}
                name="url"
            />
            <input
                id="file-input"
                type="file"
                accept=".txt"
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
            />
            <button type="button">
                <label htmlFor="file-input" className={styles.button}>
                    {reactTranslator.getMessage('options_custom_filter_modal_add_browse_button')}
                </label>
            </button>
            <button
                type="submit"
                disabled={textareaValue.trim().length === 0}
            >
                {reactTranslator.getMessage('options_custom_filter_modal_add_add_button')}
            </button>
        </form>
    );
};
