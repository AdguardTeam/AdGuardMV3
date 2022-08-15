import React, { useContext, useState } from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react';

import { REGEX_DOMAIN } from 'Common/constants/common';
import { KEY_ENTER } from 'Common/constants/keyboard';
import { useKeyPress } from 'Common/hooks/useKeyPress';
import { translator } from 'Common/translators/translator';
import { CheckboxOption } from 'Options/components/CheckboxOption';
import { rootStore } from 'Options/stores';
import { useNotifyDynamicRulesLimitsError } from 'Options/hooks/useNotifyDynamicRulesLimitError';
import { theme } from 'Common/styles';

enum UNBLOCK_OPTIONS {
    LINKS = 'LINKS',
    HIDDEN_ELEMENTS = 'HIDDEN_ELEMENTS',
    ADVANCED_RULES = 'ADVANCED_RULES',
}

const unblockOptionsMap = {
    [UNBLOCK_OPTIONS.LINKS]: {
        title: translator.getMessage('options_user_rule_unblock_subrequests'),
    },
    [UNBLOCK_OPTIONS.HIDDEN_ELEMENTS]: {
        title: translator.getMessage('options_user_rule_unhide_elements'),
    },
    [UNBLOCK_OPTIONS.ADVANCED_RULES]: {
        title: translator.getMessage('options_user_rule_removing_elements'),
    },
};

const buildUnblockingRule = (domain: string, options: typeof DEFAULT_UNBLOCK_OPTIONS) => {
    const MODIFIERS_MAP = {
        [UNBLOCK_OPTIONS.LINKS]: ['urlblock'],
        [UNBLOCK_OPTIONS.HIDDEN_ELEMENTS]: ['elemhide'],
        [UNBLOCK_OPTIONS.ADVANCED_RULES]: ['content', 'jsinject'],
    };

    const enabledOptions = Object.entries(options)
        .map(([key, value]) => (value ? key : null))
        .filter((option): option is UNBLOCK_OPTIONS => (option !== null));

    const modifiers = enabledOptions.map((option) => MODIFIERS_MAP[option]);

    const modifiersString = `$${modifiers.join(',')}`;

    return `@@||${domain}^${modifiersString}`;
};

const DEFAULT_DOMAIN = '';
const DEFAULT_UNBLOCK_OPTIONS = {
    [UNBLOCK_OPTIONS.LINKS]: false,
    [UNBLOCK_OPTIONS.HIDDEN_ELEMENTS]: false,
    [UNBLOCK_OPTIONS.ADVANCED_RULES]: true,
};

export const NewUserRuleUnblocking = observer(() => {
    const { optionsStore } = useContext(rootStore);

    const checkAndNotifyDynamicRulesError = useNotifyDynamicRulesLimitsError();

    const [domain, setDomain] = useState(DEFAULT_DOMAIN);
    const [unblockOptions, setUnblockOptions] = useState(DEFAULT_UNBLOCK_OPTIONS);

    const onDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDomain(e.target.value);
    };

    const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUnblockOptions({ ...unblockOptions, [e.target.id]: e.target.checked });
    };

    const onSave = async () => {
        if (domain.match(REGEX_DOMAIN)) {
            const rule = buildUnblockingRule(domain, unblockOptions);
            const err = await optionsStore.addNewUserRule(rule);
            checkAndNotifyDynamicRulesError(err);
        } else {
            optionsStore.setError(translator.getMessage('options_user_rule_wrong_domain_format'));
        }
    };

    const renderOption = (id: UNBLOCK_OPTIONS) => {
        const option = unblockOptionsMap[id];
        const checked = unblockOptions[id];

        return (
            <CheckboxOption
                id={id}
                message={option.title}
                checked={checked}
                onChange={onCheckboxChange}
            />
        );
    };

    const onFocus = () => {
        optionsStore.resetError();
    };

    useKeyPress(KEY_ENTER, () => onSave(), [domain]);

    return (
        <div className={theme.modal.itemWrapper}>
            <div className={theme.modal.label}>
                {translator.getMessage('options_user_rule_block_domain')}
            </div>
            <input
                className={theme.modal.modalInput}
                value={domain}
                placeholder="example.com"
                onChange={onDomainChange}
                onFocus={onFocus}
            />
            <div className={theme.modal.checkboxGroup}>
                {renderOption(UNBLOCK_OPTIONS.LINKS)}
                {renderOption(UNBLOCK_OPTIONS.HIDDEN_ELEMENTS)}
                {renderOption(UNBLOCK_OPTIONS.ADVANCED_RULES)}
            </div>
            {optionsStore.error && (
                <div className={theme.common.error}>
                    {optionsStore.error}
                </div>
            )}
            <div className={theme.modal.footer}>
                <button
                    disabled={!domain}
                    type="button"
                    className={cn(theme.button.middle, theme.button.green)}
                    onClick={onSave}
                >
                    {translator.getMessage('options_user_rule_wizard_button_add')}
                </button>
            </div>
        </div>
    );
});
