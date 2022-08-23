import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import { translator } from 'Common/translators/translator';
import { Button } from 'Common/components/Button';
import { Section, Header } from 'Common/components/Section';
import { IconId } from 'Common/components/ui';
import { Editor } from 'Options/components/UserRules/Editor';
import { useStore } from 'Options/stores/useStore';
import { UserRulesGroups } from 'Options/components/UserRules/UserRulesGroups';
import { UserRuleWizard } from 'Options/components/UserRules/UserRuleWizard';

import { DynamicRulesLimitation } from '../DynamicRulesLimitation';

export const UserRules = observer(() => {
    const {
        searchStore,
        optionsStore,
    } = useStore();

    const {
        closeSearch,
        openSearch,
    } = searchStore;

    useEffect(() => {
        return searchStore.closeSearch;
    }, []);

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        searchStore.setSearchValue(e.currentTarget.value);
    };

    const openEditor = () => {
        optionsStore.openEditor();
    };

    const closeEditor = () => {
        optionsStore.closeEditor();
    };

    const openAddUserRuleWizard = () => {
        optionsStore.openNewUserRuleWizard();
    };

    const handleBackClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (optionsStore.editorOpen) {
            e.preventDefault();
            closeEditor();
        }
        closeSearch();
    };

    const renderContent = (editorOpen: boolean) => {
        if (editorOpen) {
            return <Editor />;
        }
        return (
            <>
                <Button
                    icon={IconId.MENU}
                    handleClick={openEditor}
                    message={translator.getMessage('options_user_rule_open_editor')}
                />
                <Button
                    icon={IconId.PLUS}
                    handleClick={openAddUserRuleWizard}
                    message={translator.getMessage('options_user_rule_add_user_rule')}
                />
                <UserRulesGroups />
            </>
        );
    };

    return (
        <Section
            header={(
                <Header
                    isOpen={searchStore.isSearchOpen}
                    handleBackClick={handleBackClick}
                    handleSearchClick={optionsStore.editorOpen ? undefined : openSearch}
                    pageTitle={
                        optionsStore.editorOpen
                            ? translator.getMessage('options_user_rules_option_editor')
                            : translator.getMessage('options_user_rules_option')
                    }
                    searchValue={searchStore.searchValue}
                    handleCloseSearchClick={closeSearch}
                    handleSearchInputChange={handleSearchInputChange}
                />
            )}
        >
            <DynamicRulesLimitation />
            {renderContent(optionsStore.editorOpen)}
            <UserRuleWizard />
        </Section>
    );
});
