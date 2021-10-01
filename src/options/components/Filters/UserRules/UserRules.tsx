import React, { useEffect } from 'react';
import {
    Route,
    Switch,
    useHistory,
    useLocation,
    useRouteMatch,
} from 'react-router-dom';
import Modal from 'react-modal';
import { reactTranslator } from 'Common/translators/reactTranslator';
import { observer } from 'mobx-react';
import { FilterHeader } from 'Options/components/Filters/FiltersHeader';
import { Editor } from 'Options/components/Filters/Editor';
import { useStore } from 'Options/stores/useStore';
import { UserRulesBase } from 'Options/components/Filters/UserRules/UserRulesBase';

import styles from 'Options/components/Filters/UserRules/UserRules.module.pcss';

Modal.setAppElement('#root');

export const UserRules = observer(() => {
    const { searchStore } = useStore();
    const {
        closeSearch,
        openSearch,
    } = searchStore;

    const history = useHistory();
    const { pathname } = useLocation();
    const { url, path } = useRouteMatch();

    useEffect(() => {
        return searchStore.closeSearch;
    }, []);

    const editorPathPart = '/editor';
    const showEditor = pathname.endsWith(editorPathPart);

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        searchStore.setSearchValue(e.currentTarget.value);
    };

    const toggleEditor = () => {
        history.push(showEditor ? `${url}` : `${url}${editorPathPart}`);
    };

    // FIXME modal overlay
    return (
        <>
            <div className={styles.container}>
                <FilterHeader
                    isOpen={searchStore.isSearchOpen}
                    handleBackClick={closeSearch}
                    handleSearchClick={showEditor ? undefined : openSearch}
                    pageTitle={reactTranslator.getMessage('options_user_rules_option') as string}
                    searchValue={searchStore.searchValue}
                    handleMenuClick={toggleEditor}
                    handleCloseSearchClick={closeSearch}
                    handleSearchInputChange={handleSearchInputChange}
                />
            </div>
            <Switch>
                <Route exact path={path} component={UserRulesBase} />
                <Route path={`${path}${editorPathPart}`} component={Editor} />
            </Switch>
        </>
    );
});
