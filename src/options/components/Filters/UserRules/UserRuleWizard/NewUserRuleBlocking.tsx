import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react';
import cn from 'classnames';

import { REGEX_DOMAIN } from 'Common/constants/common';
import { KEY_ENTER } from 'Common/constants/keyboard';
import { useKeyPress } from 'Common/hooks/useKeyPress';
import { translator } from 'Common/translators/translator';
import { theme } from 'Common/styles';
import { CheckboxOption } from 'Options/components/CheckboxOption';
import { rootStore } from 'Options/stores';

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

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDomain(e.target.value);
    };

    const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBlockSubdomains(e.target.checked);
    };

    const onSave = () => {
        if (domain.match(REGEX_DOMAIN)) {
            const rule = buildBlockingRule(domain, blockSubdomains);
            optionsStore.addNewUserRule(rule);
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
            <input
                className={theme.modal.modalInput}
                defaultValue={domain}
                onChange={onChange}
                placeholder="domain.com"
                onFocus={onFocus}
            />
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
                    {translator.getMessage('options_custom_filter_modal_confirm_save_button')}
                </button>
            </div>
        </>
    );
});
