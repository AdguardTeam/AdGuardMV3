import { useContext } from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react';

import { translate } from '../../../common/helpers';
import { rootStore } from '../../stores';

import './index.pcss';

export const PageInfo = observer(() => {
    const { settingsStore } = useContext(rootStore);
    const { protectionEnabled } = settingsStore;

    const label = cn({
        protection_enabled_status: protectionEnabled,
        protection_disabled_status: !protectionEnabled,
    });

    return (
        <section>
            <h1 className="page-info page-info__main">fonts.google.com</h1>
            <h6 className="page-info page-info__additional">{translate(label)}</h6>
        </section>
    );
});
