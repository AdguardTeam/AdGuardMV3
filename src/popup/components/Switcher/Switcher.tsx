import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import cn from 'classnames';

import { Icon } from '../../../common/components/ui/Icon';
import { rootStore } from '../../stores';

import './switcher.pcss';

export const Switcher = observer(() => {
    const { settingsStore } = useContext(rootStore);
    const { protectionEnabled, setProtectionEnabled } = settingsStore;

    const onClick = async () => {
        await setProtectionEnabled(!protectionEnabled);
    };

    const icon = cn({
        checkmark: protectionEnabled,
        circle: !protectionEnabled,
    });

    const className = cn('switcher', {
        'switcher--disabled': !protectionEnabled,
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
