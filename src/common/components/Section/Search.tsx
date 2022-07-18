/* eslint-disable jsx-a11y/no-autofocus */
import React, { useRef } from 'react';
import { observer } from 'mobx-react';

import { useKeyPress } from 'Common/hooks/useKeyPress';
import { KEY_ESCAPE } from 'Common/constants/keyboard';

import { IconId, Icon } from '../ui';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { translator } from '../../translators/translator';

import styles from './Section.module.pcss';

interface SearchProps {
    value: string,
    handleCloseSearchClick: () => void,
    handleSearchInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

export const Search = observer(({
    value,
    handleCloseSearchClick,
    handleSearchInputChange,
}: SearchProps) => {
    const formRef = useRef<HTMLFormElement>(null);

    useOutsideClick(formRef, handleCloseSearchClick);
    useKeyPress(KEY_ESCAPE, handleCloseSearchClick);

    return (
        <form ref={formRef} className={styles.searchContainer}>
            <input
                autoFocus
                type="text"
                placeholder={translator.getMessage('options_rules_search')}
                value={value}
                onChange={handleSearchInputChange}
                className={styles.search}
            />
            <button
                type="button"
                onClick={handleCloseSearchClick}
            >
                <Icon id={IconId.CROSS} />
            </button>
        </form>
    );
});
