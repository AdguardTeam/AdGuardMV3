import { useContext } from 'react';
import { observer } from 'mobx-react';

import { translate } from '../../../common/helpers';
import { rootStore } from '../../stores';
import { Icon } from '../ui/Icon';

import './index.pcss';

export const Header = observer(() => {
    const { settingsStore } = useContext(rootStore);
    const { protectionEnabled, setProtectionEnabled } = settingsStore;

    const handleEnableClick = async () => {
        await setProtectionEnabled(false);
    };

    const handlePauseClick = async () => {
        await setProtectionEnabled(true);
    };

    const handleSettingsClick = (e) => {
        e.preventDefault();
        // messenger.openSettingsTab();
        window.close();
    };

    return (
        <div className="popup-header">
            <div className="popup-header__logo">
                {protectionEnabled}
                <Icon
                    id="#logo"
                    className="icon--logo"
                />
            </div>
            <div className="popup-header__buttons">
                {!protectionEnabled
                && (
                    <button
                        className="button"
                        type="button"
                        onClick={handlePauseClick}
                        title={translate('context_disable_protection')}
                    >
                        <Icon
                            id="#pause"
                            className="icon--button"
                        />
                    </button>
                )}
                {protectionEnabled
                && (
                    <button
                        className="button"
                        type="button"
                        onClick={handleEnableClick}
                        title={translate('context_enable_protection')}
                    >
                        <Icon
                            id="#start"
                            className="icon--button"
                        />
                    </button>
                )}
                <button
                    className="button"
                    type="button"
                    onClick={handleSettingsClick}
                    title={translate('options_settings')}
                >
                    <Icon
                        id="#settings"
                        className="icon--button"
                    />
                </button>
            </div>
        </div>
    );
});
