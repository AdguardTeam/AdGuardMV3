import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react';
import cn from 'classnames';

import { REGEX_DOMAIN } from 'Common/constants/common';
import { KEY_ENTER } from 'Common/constants/keyboard';
import { useKeyPress } from 'Common/hooks/useKeyPress';
import { translator } from 'Common/translators/translator';
import { theme } from 'Common/styles';
import { rootStore } from 'Options/stores';
import { CheckboxOption } from 'Options/components/CheckboxOption';
import { useNotifyDynamicRulesLimitsError } from 'Options/hooks/useNotifyDynamicRulesLimitError';

const buildBlockingRule = (domain: string, blockSubdomains: boolean): string => {
    if (blockSubdomains) {
        return `||${domain}^`;
    }
    return `://${domain}^`;
};

const DEFAULT_BLOCK_SUBDOMAINS = true;
const DEFAULT_DOMAIN = '';

export const NewUserRuleBlocking = observer(() => {
    const { optionsStore } = useContext(rootStore);
    const [domain, setDomain] = useState('');
    const [blockSubdomains, setBlockSubdomains] = useState(DEFAULT_BLOCK_SUBDOMAINS);

    const checkAndNotifyDynamicRulesError = useNotifyDynamicRulesLimitsError();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDomain(e.target.value);
    };

    const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBlockSubdomains(e.target.checked);
    };

    const onSave = async () => {
        if (domain.match(REGEX_DOMAIN)) {
            const rule = buildBlockingRule(domain, blockSubdomains);
            const err = await optionsStore.addNewUserRule(rule);
            checkAndNotifyDynamicRulesError(err);
            setDomain(DEFAULT_DOMAIN);
            setBlockSubdomains(DEFAULT_BLOCK_SUBDOMAINS);
        } else {
            optionsStore.setError(translator.getMessage('options_user_rule_wrong_domain_format'));
        }
    };

    useKeyPress(KEY_ENTER, () => onSave(), [domain]);

    const message = translator.getMessage('options_user_rule_block_all_subdomains');

    const onFocus = () => {
        optionsStore.resetError();
    };

    return (
        <>
            <div className={theme.modal.itemWrapper}>
                <div className={theme.modal.label}>
                    {translator.getMessage('options_user_rule_block_domain')}
                </div>
                <input
                    className={theme.modal.modalInput}
                    defaultValue={domain}
                    onChange={onChange}
                    placeholder="example.com"
                    onFocus={onFocus}
                />
            </div>
            <div className={theme.modal.checkboxGroup}>
                <CheckboxOption
                    key={message}
                    id={message}
                    message={message}
                    checked={blockSubdomains}
                    onChange={onCheckboxChange}
                />
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
        </>
    );
});
