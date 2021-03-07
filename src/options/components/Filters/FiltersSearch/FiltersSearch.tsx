import React, { useContext } from 'react';
import { observer } from 'mobx-react';

import { rootStore } from '../../../stores';

export const FiltersSearch = observer(() => {
    const { searchStore } = useContext(rootStore);

    const handleCloseSearchClick = () => {
        searchStore.closeSearch();
    };

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.persist();
        searchStore.setSearchValue(e.currentTarget.value);
    };

    return (
        <form>
            <input
                type="text"
                placeholder="Search"
                defaultValue={searchStore.searchValue}
                onChange={handleSearchInputChange}
            />
            {/* FIXME change button from text to icon */}
            <button
                type="button"
                onClick={handleCloseSearchClick}
            >
                close
            </button>
        </form>
    );
});
