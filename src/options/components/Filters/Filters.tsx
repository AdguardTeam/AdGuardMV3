import React, { useContext, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import Modal from 'react-modal';

import { reactTranslator } from 'Common/translators/reactTranslator';
import { Filter } from './Filter';
import s from './Filters.module.pcss';
import { rootStore } from '../../stores';
import { CustomFilterModal } from './CustomFilterModal';

Modal.setAppElement('#root');

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const CUSTOM_GROUP_ID = '0';
const LANGUAGES_GROUP_ID = '1';

const TITLES_MAP: { [key: string]: string } = {
    [CUSTOM_GROUP_ID]: 'Custom filters',
    [LANGUAGES_GROUP_ID]: 'Languages',
};

const getPageTitle = (groupId: string): string | null => {
    return TITLES_MAP[groupId] || null;
};

export const Filters = observer(() => {
    const { settingsStore } = useContext(rootStore);
    // FIXME set default to false
    const [isCustomFilterModalOpen, setIsCustomFilterModalOpen] = useState(true);
    const history = useHistory();

    const { filters } = settingsStore;

    const query = useQuery();

    const groupId = query.get('groupId');

    if (!groupId) {
        throw new Error('groupId should be provided in query string');
    }

    const isCustomGroup = groupId === CUSTOM_GROUP_ID;

    const pageTitle = getPageTitle(groupId);

    // FIXME add search

    const filtersByGroupId = filters.filter((filter) => filter.groupId === parseInt(groupId, 10));

    // FIXME add new custom filter modal
    // FIXME handle clicks to links for subscribe to new filters

    const handleBackClick = () => {
        history.push('/');
    };

    const handleAddCustomFilter = () => {
        setIsCustomFilterModalOpen(true);
    };

    const closeAddCustomFilterModal = () => {
        setIsCustomFilterModalOpen(false);
    };

    return (
        <>
            <CustomFilterModal
                isOpen={isCustomFilterModalOpen}
                closeHandler={closeAddCustomFilterModal}
            />
            <button
                onClick={handleBackClick}
                className={s.button}
                type="button"
            >
                back
            </button>
            <h1>{pageTitle}</h1>
            <button className={s.button} type="button">
                Search
            </button>
            {isCustomGroup && (
                <button
                    className={s.button}
                    onClick={handleAddCustomFilter}
                    type="button"
                >
                    {reactTranslator.getMessage('options_add_custom_filter')}
                </button>
            )}

            <div className="option__container">
                {filtersByGroupId.map((filter) => {
                    return (
                        <Filter
                            key={filter.id}
                            id={filter.id}
                            title={filter.title}
                            enabled={filter.enabled}
                        />
                    );
                })}
            </div>
        </>
    );
});
