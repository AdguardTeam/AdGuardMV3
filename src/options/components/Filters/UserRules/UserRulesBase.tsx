import { observer } from 'mobx-react';
import { useStore } from 'Options/stores/useStore';
import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Modal from 'react-modal';
import cn from 'classnames';
import { USER_RULE_STATUS, UserRuleType } from 'Options/stores/OptionsStore';
import { groupByKeyValue } from 'Common/helpers';
import { CheckboxOption } from 'Options/components/CheckboxOption';
import { ModalButton } from 'Common/components/ModalButton';
import { reactTranslator } from 'Common/translators/reactTranslator';
import { UserRule } from 'Options/components/Filters/UserRule';
import { Icon, ICON_ID } from 'Common/components/ui';

import styles from 'Options/components/Filters/UserRules/UserRules.module.pcss';

export const UserRulesBase = observer(() => {
    const { optionsStore, searchStore } = useStore();
    const {
        matchesSearchQuery,
    } = searchStore;

    const {
        setRuleInputType,
        resetRuleInputType,
        ruleInputType,
        parsedUserRules,
        addRawUserRule,
        userRuleInput,
        rawUserRules,
        setRawUserRules,
        updateUserRuleInput,
        resetUserRuleInput,
        RULE_INPUT_TYPE,
    } = optionsStore;

    const [modalOpen, setModalOpen] = useState<'edit' | 'add'>();

    const location = useLocation();

    const onChangeUserRuleInput = (
        evt: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    ) => {
        updateUserRuleInput(evt.target.value);
    };

    const modalClass = cn(styles.modal, {
        [styles.modal2]: RULE_INPUT_TYPE.IS_CUSTOM,
    });

    const buttonsClass = cn(styles.buttonsGroup, {
        [styles.buttonsGroup2]: RULE_INPUT_TYPE.IS_SITE_ALLOWED,
    });

    const closeModal = () => {
        setModalOpen(undefined);
        resetRuleInputType();
        resetUserRuleInput();
    };

    const saveRule = () => {
        addRawUserRule(userRuleInput);
        resetUserRuleInput();
        closeModal();
    };

    const openModal = () => {
        setModalOpen('add');
    };

    const openEditModal = (rule: string) => {
        setModalOpen('edit');
        updateUserRuleInput(rule);
    };

    const onDeleteClick = () => {
        const updatedUserRules = rawUserRules.filter((rule: string) => rule !== userRuleInput);
        setRawUserRules(updatedUserRules);
        closeModal();
    };

    const selectOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRuleInputType(e.target.value as USER_RULE_STATUS);
        resetUserRuleInput();
    };

    const filteredRules = useMemo(
        () => {
            const predicate = ({ rule, domain, status }: UserRuleType) => [rule, domain, status]
                .some(matchesSearchQuery);

            return groupByKeyValue(parsedUserRules.filter(predicate), 'domain');
        },
        [parsedUserRules.length, searchStore.searchQuery, location.pathname],
    );

    const userRuleEnum = {
        [USER_RULE_STATUS.CUSTOM]: () => (
            <textarea
                className={styles.modalTextarea}
                value={userRuleInput}
                onChange={onChangeUserRuleInput}
            />
        ),
        [USER_RULE_STATUS.SITE_BLOCKED]: () => (
            <>
                <input
                    className={styles.modalInput}
                    value={userRuleInput}
                    onChange={onChangeUserRuleInput}
                />
                <div className={styles.checkboxGroup}>
                    <CheckboxOption
                        id="checkbox"
                        messageKey="options_user_rule_block_all_subdomains"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            console.log('options_user_rule_block_all_subdomains', e.target.value);
                        }}
                        containerClass={styles.checkboxContainer}
                    />
                </div>
            </>
        ),
        // FIXME
        [USER_RULE_STATUS.ELEMENT_BLOCKED]: () => (
            <>
                <input
                    className={styles.modalInput}
                    value={userRuleInput}
                    onChange={onChangeUserRuleInput}
                />
                <div className={styles.checkboxGroup}>
                    <CheckboxOption
                        id="checkbox"
                        messageKey="options_user_rule_block_all_subdomains"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            console.log('options_user_rule_block_all_subdomains', e.target.value);
                        }}
                        containerClass={styles.checkboxContainer}
                    />
                </div>
            </>
        ),
        [USER_RULE_STATUS.SITE_ALLOWED]: () => (
            <>
                <input
                    className={styles.modalInput}
                    value={userRuleInput}
                    onChange={onChangeUserRuleInput}
                />
                <div className={styles.checkboxGroup}>
                    <CheckboxOption
                        id="checkbox1"
                        messageKey="options_user_rule_blocking_urls"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            console.log('options_user_rule_blocking_urls', e.target.value);
                        }}
                        iconId={ICON_ID.LINK}
                        className={styles.option}
                        containerClass={styles.optionContainer}
                    />
                    <CheckboxOption
                        id="checkbox2"
                        messageKey="options_user_rule_hiding_elements"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            console.log('options_user_rule_hiding_elements', e.target.value);
                        }}
                        iconId={ICON_ID.EYE}
                        className={styles.option}
                        containerClass={styles.optionContainer}
                    />
                    <CheckboxOption
                        id="checkbox3"
                        messageKey="options_user_rule_removing_elements"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            console.log('options_user_rule_removing_elements', e.target.value);
                        }}
                        iconId={ICON_ID.CROSSED_ELEMENT}
                        className={styles.option}
                        containerClass={styles.optionContainer}
                    />
                    <CheckboxOption
                        id="checkbox4"
                        messageKey="options_user_rule_advanced_rules"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            console.log('options_user_rule_advanced_rules', e.target.value);
                        }}
                        iconId={ICON_ID.LIGHTNING}
                        className={styles.option}
                        containerClass={styles.optionContainer}
                    />
                </div>
            </>
        ),
    };

    const content = userRuleEnum[ruleInputType]();

    return (
        <>
            <ModalButton
                handleClick={openModal}
                message={reactTranslator.getMessage('options_user_rule_add_user_rule') as string}
            />
            {Object.entries(filteredRules).map(([domain, rules]) => {
                return (
                    <div key={domain} className={styles.domainGroup}>
                        <div className={styles.domain}>{domain}</div>
                        {rules.map(
                            ({ rule, status }: UserRuleType) => {
                                const open = () => {
                                    openEditModal(rule);
                                };

                                return (
                                    <UserRule
                                        key={rule}
                                        rule={rule}
                                        status={status}
                                        onClick={open}
                                    />
                                );
                            },
                        )}
                    </div>
                );
            })}
            <Modal
                isOpen={!!modalOpen}
                onRequestClose={closeModal}
                contentLabel="Example Modal"
                bodyOpenClassName="bodyOpenClassName"
                className={modalClass}
            >
                <div className={styles.contentContainer}>
                    <h1 className={styles.heading}>
                        {reactTranslator.getMessage(modalOpen === 'add'
                            ? 'options_user_rule_add_rule' : 'options_user_rule_edit_rule')}
                    </h1>
                    <button onClick={closeModal} className={styles.closeIcon} type="button">
                        <Icon id={ICON_ID.CROSS} />
                    </button>
                    <div className={styles.modalSelectContainer}>
                        <select className={styles.modalSelect} onChange={selectOption}>
                            <option value={USER_RULE_STATUS.CUSTOM}>
                                {reactTranslator.getMessage('options_user_rule_text_rule_manually')}
                            </option>
                            <option
                                value={USER_RULE_STATUS.SITE_BLOCKED}
                            >
                                {reactTranslator.getMessage('options_user_rule_block_website')}
                            </option>
                            <option
                                value={USER_RULE_STATUS.SITE_ALLOWED}
                            >
                                {reactTranslator.getMessage('options_user_rule_allow_website')}
                            </option>
                        </select>
                        <Icon id={ICON_ID.CHEVRON_DOWN} className={styles.chevron} />
                    </div>
                    {content}
                    <div className={buttonsClass}>
                        {RULE_INPUT_TYPE.IS_CUSTOM && (
                            <button
                                type="button"
                                className={styles.btnDelete}
                                onClick={onDeleteClick}
                            >
                                {reactTranslator.getMessage('options_user_rule_delete')}
                            </button>
                        )}
                        <button
                            type="button"
                            className={styles.btnSave}
                            onClick={saveRule}
                        >
                            {reactTranslator.getMessage('options_user_rule_save')}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
});
