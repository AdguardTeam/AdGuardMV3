/* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */
import React, { useContext } from 'react';

import { Icon } from 'Common/components/ui/Icon';
import { Checkbox } from 'Common/components/Checkbox';
import { ICON_ID } from 'Common/components/ui/Icons';
import { rootStore } from '../../stores';

type FilterProps = {
    id: number,
    title: string,
    enabled: boolean,
};

export const Filter = ({ id, title, enabled }: FilterProps) => {
    const { settingsStore } = useContext(rootStore);

    const onChange = () => {
        if (enabled) {
            settingsStore.disableFilter(id);
        } else {
            settingsStore.enableFilter(id);
        }
    };

    const handleClickToFilter = (e: React.SyntheticEvent) => {
        e.preventDefault();
        settingsStore.openCustomFilterModal(id);
    };

    return (
        <div key={id} className="option__item">
            <div onClick={handleClickToFilter}>
                <Icon id={ICON_ID.CUSTOM_FILTERS} className="icon--option" />
                <label
                    htmlFor={String(id)}
                    className="option__label"
                >
                    {title}
                </label>
            </div>
            <Checkbox id={String(id)} checked={enabled} onChange={onChange} />
        </div>
    );
};
