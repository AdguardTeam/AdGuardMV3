import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import cn from 'classnames';

import { Icon } from 'Common/components/ui/Icon';
import { rootStore } from '../../stores';
import { SETTINGS_NAMES } from '../../../background/settings/settings-constants';

import './switcher.pcss';

export const Switcher = observer(() => {
    const { settingsStore } = useContext(rootStore);
    const { isFilteringEnabled, setSetting } = settingsStore;

    const onClick = async () => {
        await setSetting(SETTINGS_NAMES.FILTERING_ENABLED, !isFilteringEnabled);
    };

    const icon = cn({
        checkmark: isFilteringEnabled,
        circle: !isFilteringEnabled,
    });

    const className = cn('switcher', {
        'switcher--disabled': !isFilteringEnabled,
    });

    return (
        <button
            type="button"
            className={className}
            onClick={onClick}
        >
            <div className="switcher__center" />
            <div className="switcher__btn">
                <Icon id={icon} className="switcher__icon" />
            </div>
        </button>
    );
});
