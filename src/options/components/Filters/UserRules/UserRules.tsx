import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import { translator } from 'Common/translators/translator';
import { Button } from 'Common/components/Button';
import { Section, Header } from 'Common/components/Section';
import { IconId } from 'Common/components/ui';
import { Editor } from 'Options/components/Filters/UserRules/Editor';
import { useStore } from 'Options/stores/useStore';
import { UserRulesGroups } from 'Options/components/Filters/UserRules/UserRulesGroups';
import { UserRuleWizard } from 'Options/components/Filters/UserRules/UserRuleWizard';

import { DynamicRulesLimitation } from '../../DynamicRulesLimitation';

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

    useEffect(() => {
        optionsStore.fetchUserRules();
    }, []);

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        searchStore.setSearchValue(e.currentTarget.value);
    };

    const openEditor = () => {
        optionsStore.openEditor();
    };

    const openAddUserRuleWizard = () => {
        optionsStore.openNewUserRuleWizard();
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
                    handleBackClick={closeSearch}
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
