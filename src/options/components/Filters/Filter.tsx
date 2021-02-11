import React, { useContext } from 'react';

import { Icon } from 'Common/components/ui/Icon';
import { Checkbox } from 'Common/components/Checkbox';
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

    return (
        <div key={id} className="option__item">
            <Icon id="custom_filters_icon" className="icon--option" />
            <label
                htmlFor={String(id)}
                className="option__label"
            >
                {title}
            </label>
            <Checkbox id={String(id)} checked={enabled} onChange={onChange} />
        </div>
    );
};
