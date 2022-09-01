import React, { useContext } from 'react';
import { observer } from 'mobx-react';

import { rootStore } from 'Options/stores';
import { SwitcherOption } from 'Options/components/SwitcherOption';
import { Category } from 'Options/components/Category';
import { translator } from 'Common/translators/translator';
import { Filter, FiltersGroupId } from 'Common/constants/common';
import { FILTER_RULESET, RulesetType } from 'Common/constants/filters';

import { useNotifyStaticFiltersLimitError } from '../../hooks/useNotifyStaticFiltersLimitError';
import { StaticRulelistsLimitation } from '../StaticRulelistsLimitation';

import styles from './Languages.module.pcss';

export const Languages = observer(() => {
    const { settingsStore } = useContext(rootStore);

    const checkAndNotifyStaticFiltersError = useNotifyStaticFiltersLimitError();

    const {
        filters,
        enableFilter,
        disableFilter,
    } = settingsStore;

    const tryEnableFilter = async (filterId: number) => {
        const err = await enableFilter(filterId);
        checkAndNotifyStaticFiltersError(err);
    };

    const onChange = async (filter: Filter) => {
        if (filter.enabled) {
            await disableFilter(filter.id);
        } else {
            await tryEnableFilter(filter.id);
        }
    };

    const languagesFilters = filters.filter((filter: Filter) => (
        filter.groupId === FiltersGroupId.LANGUAGES
        || filter.groupId === FiltersGroupId.INTEGRATED));

    const integratedFilter = filters.find((filter: Filter) => (
        filter.id === FILTER_RULESET[RulesetType.RULESET_2].id
    ));

    const getRulesMessage = (count: number) => (
        translator.getPlural('options_filter_rules_counter', count, { count })
    );

    return (
        <Category
            navLink="/"
            headerName={translator.getMessage('options_languages_option')}
            headerDesc={translator.getMessage('options_languages_option_header_desc')}
        >
            <>
                <StaticRulelistsLimitation />
                <div className={styles.container}>
                    <SwitcherOption
                        integrated
                        key="english_integrated"
                        id="english_integrated"
                        message={translator.getMessage('options_languages_english')}
                        title={getRulesMessage(integratedFilter?.declarativeRulesCounter || 0)}
                    />
                    {languagesFilters.map((filter) => (
                        <SwitcherOption
                            key={filter.id}
                            integrated={filter.groupId === FiltersGroupId.INTEGRATED}
                            id={filter.id.toString()}
                            message={filter.title}
                            checked={filter.enabled}
                            onChange={() => { onChange(filter); }}
                            title={getRulesMessage(filter.declarativeRulesCounter || 0)}
                        />
                    ))}
                </div>
            </>
        </Category>
    );
});
