import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import Modal from 'react-modal';

import { reactTranslator } from 'Common/translators/reactTranslator';
import { CUSTOM_GROUP_ID } from 'Common/constants';
import { ICON_ID } from 'Common/components/ui';
import { FilterHeader } from 'Options/components/Filters/FiltersHeader';
import { rootStore } from 'Options/stores';
import { CustomFilterModal } from 'Options/components/Filters/CustomFilterModal';
import { CheckboxOption } from 'Options/components/CheckboxOption';
import { ModalButton } from 'Common/components/ModalButton/ModalButton';

import styles from './Filters.module.pcss';

Modal.setAppElement('#root');

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

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

    const {
        openModal,
        closeModal,
    } = customFilterModalStore;

    const {
        openSearch,
        closeSearch,
        matchesSearchQuery,
        setSearchValue,
    } = searchStore;

    const {
        disableFilter,
        enableFilter,
    } = settingsStore;

    useEffect(() => {
        return searchStore.closeSearch;
    }, []);

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
        .filter((filter) => filter.groupId === parsedGroupId)
        .filter((filter) => matchesSearchQuery(filter.title));

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.currentTarget.value);
    };

    return (
        <>
            <CustomFilterModal
                isOpen={customFilterModalStore.isModalOpen}
                closeHandler={closeModal}
            />
            <FilterHeader
                isOpen={searchStore.isSearchOpen}
                handleBackClick={closeSearch}
                handleSearchClick={openSearch}
                handleCloseSearchClick={closeSearch}
                handleSearchInputChange={handleSearchInputChange}
                searchValue={searchStore.searchValue}
                pageTitle={pageTitle || ''}
            />
            {isCustomGroup && (
                <ModalButton
                    handleClick={openModal}
                    message={reactTranslator.getMessage('options_add_custom_filter') as string}
                />
            )}
            <div className={styles.container}>
                {filtersByGroupId?.length > 0
                    ? filtersByGroupId.map((filter) => {
                        const onChange = async () => {
                            if (filter.enabled) {
                                await disableFilter(filter.id);
                            } else {
                                await enableFilter(filter.id);
                            }
                        };

                        return (
                            <CheckboxOption
                                iconId={ICON_ID.CUSTOM_FILTERS}
                                key={filter.id}
                                id={filter.id.toString()}
                                message={filter.title}
                                checked={filter.enabled}
                                onChange={onChange}
                            />
                        );
                    })
                    : <div className={styles.notFound}>{reactTranslator.getMessage('options_filters_not_found')}</div>}
            </div>
        </>
    );
});
