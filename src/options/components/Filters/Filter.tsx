/* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */
import React, { useContext } from 'react';

import { Icon, ICON_ID } from 'Common/components/ui';
import { Checkbox } from 'Common/components/Checkbox';
import { rootStore } from '../../stores';

import styles from './Filters.module.pcss';

type FilterProps = {
    id: number,
    title: string,
    enabled: boolean,
};

export const Filter = ({ id, title, enabled }: FilterProps) => {
    const { settingsStore, customFilterModalStore } = useContext(rootStore);

    const onChange = () => {
        if (enabled) {
            settingsStore.disableFilter(id);
        } else {
            settingsStore.enableFilter(id);
        }
    };

    const handleClickToFilter = (e: React.SyntheticEvent) => {
        e.preventDefault();
        customFilterModalStore.openRemoveCustomFilterModal(id);
    };

    return (
        <div key={id} className={styles.item}>
            <div onClick={handleClickToFilter}>
                <Icon id={ICON_ID.CUSTOM_FILTERS} />
                <label
                    htmlFor={String(id)}
                    className={styles.label}
                >
                    {title}
                </label>
            </div>
            <Checkbox id={String(id)} checked={enabled} onChange={onChange} />
        </div>
    );
};
