import React, { useRef, useState } from 'react';
import { log } from 'Common/logger';

import { sender } from '../../../messaging/sender';

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
    const inputRef = useRef<HTMLInputElement>(null);

    const handleTextareaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setTextareaValue(value);
    };

    const handleBrowseClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    // TODO implement notifications module to tell users about errors
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
            // FIXME use filename if filter doesnt have title
            const filterInfo = await sender.getFilterInfo(fileContent);
            onSuccess(filterInfo, fileContent);
            if (!filterInfo) {
                const errorMessage = 'Filter format is broken';
                log.error(errorMessage);
                onError(errorMessage);
            }
        } catch (ex) {
            const errorMessage = `Filter format is broken, ${ex.message}`;
            log.error(errorMessage);
            onError(errorMessage);
        }
    };

    // FIXME disable add button until textarea is empty
    return (
        <>
            <form action="#">
                <input
                    type="textarea"
                    value={textareaValue}
                    onChange={handleTextareaChange}
                />
                <input
                    type="file"
                    accept=".txt"
                    style={{ display: 'none' }}
                    ref={inputRef}
                    onChange={handleFileInputChange}
                />
                <button
                    type="button"
                    onClick={handleBrowseClick}
                >
                    Browse
                </button>
                <button
                    type="submit"
                >
                    Add
                </button>
            </form>
        </>
    );
};
