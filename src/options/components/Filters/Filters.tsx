import React, { useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import Modal from 'react-modal';

import { reactTranslator } from 'Common/translators/reactTranslator';
import { Filter } from './Filter';
import s from './Filters.module.pcss';
import { rootStore } from '../../stores';
import { CustomFilterModal } from './CustomFilterModal';
import { FiltersSearch } from './FiltersSearch';

Modal.setAppElement('#root');

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const CUSTOM_GROUP_ID = 0;
const LANGUAGES_GROUP_ID = 1;

const TITLES_MAP: { [key: number]: string } = {
    [CUSTOM_GROUP_ID]: 'Custom filters',
    [LANGUAGES_GROUP_ID]: 'Languages',
};

const getPageTitle = (groupId: number): string | null => {
    return TITLES_MAP[groupId] || null;
};

export const Filters = observer(() => {
    const {
        settingsStore,
        searchStore,
        customFilterModalStore,
    } = useContext(rootStore);

    const history = useHistory();

    const { filters } = settingsStore;

    const query = useQuery();

    const groupId = query.get('groupId');

    if (!groupId) {
        throw new Error('groupId should be provided in query string');
    }

    const parsedGroupId = parseInt(groupId, 10);

    const isCustomGroup = parsedGroupId === CUSTOM_GROUP_ID;

    const pageTitle = getPageTitle(parsedGroupId);

    const filtersByGroupId = filters
        .filter((filter) => filter.groupId === parseInt(groupId, 10))
        .filter((filter) => searchStore.matchesSearchQuery(filter.title));

    // FIXME handle clicks to links for subscribe to new filters
    const handleBackClick = () => {
        history.push('/');
        searchStore.closeSearch();
    };

    const handleAddCustomFilter = () => {
        customFilterModalStore.openModal();
    };

    const closeCustomFilterModal = () => {
        customFilterModalStore.closeModal();
    };

    const handleSearchClick = () => {
        searchStore.openSearch();
    };

    const renderHeader = () => {
        if (searchStore.isSearchOpen) {
            return <FiltersSearch />;
        }

        return (
            <>
                <h1>{pageTitle}</h1>
                {/* FIXME change from text button to icon button */}
                <button
                    className={s.button}
                    type="button"
                    onClick={handleSearchClick}
                >
                    Search
                </button>
            </>
        );
    };

    return (
        <>
            <CustomFilterModal
                isOpen={customFilterModalStore.isModalOpen}
                closeHandler={closeCustomFilterModal}
            />
            <button
                onClick={handleBackClick}
                className={s.button}
                type="button"
            >
                back
            </button>
            { renderHeader() }
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
