/* eslint-disable jsx-a11y/no-autofocus */
import React, { useRef } from 'react';
import { observer } from 'mobx-react';
import { ICON_ID, Icon } from 'Common/components/ui';
import { useOutsideClick } from 'Common/hooks/useOutsideClick';
import { reactTranslator } from 'Common/translators/reactTranslator';

import styles from 'Options/components/Filters/FiltersSearch/FiltersSearch.module.pcss';

export type IProps = {
    value: string,
    handleCloseSearchClick: () => void,
    handleSearchInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
};

export const FiltersSearch = observer(({
    value,
    handleCloseSearchClick,
    handleSearchInputChange,
}: IProps) => {
    const formRef = useRef<HTMLFormElement>(null);

    useOutsideClick(formRef, handleCloseSearchClick);

    return (
        <form ref={formRef} className={styles.container}>
            <input
                autoFocus
                type="text"
                placeholder={reactTranslator.getMessage('options_rules_search') as string}
                value={value}
                onChange={handleSearchInputChange}
                className={styles.search}
            />
            <button
                type="button"
                onClick={handleCloseSearchClick}
            >
                <Icon id={ICON_ID.CROSS} />
            </button>
        </form>
    );
});
