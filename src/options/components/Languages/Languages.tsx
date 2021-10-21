import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { rootStore } from 'Options/stores';
import { reactTranslator } from 'Common/translators/reactTranslator';
import { CheckboxOption } from 'Options/components/CheckboxOption';
import { Category } from 'Options/components/Category';

export const Languages = observer(() => {
    const {
        settingsStore,
    } = useContext(rootStore);

    const {
        filters,
        disableFilter,
        enableFilter,
    } = settingsStore;

    const LANGUAGES_GROUP_ID = 7;

    const INTEGRATED_LIST = [4];

    return (
        <Category
            navLink="/"
            headerName={reactTranslator.getMessage('options_languages_option') as string}
        >
            <>
                {filters && filters.length > 0 && (
                    filters.map((filter) => {
                        const onChange = async () => {
                            if (filter.enabled) {
                                await disableFilter(filter.id);
                            } else {
                                await enableFilter(filter.id);
                            }
                        };

                        if (filter.groupId === LANGUAGES_GROUP_ID
                            || INTEGRATED_LIST.includes(filter.id)) {
                            return (
                                <CheckboxOption
                                    integrated={INTEGRATED_LIST.includes(filter.id)}
                                    key={filter.id}
                                    id={filter.id.toString()}
                                    message={filter.title}
                                    messageKeyDesc={filter.description}
                                    checked={filter.enabled}
                                    onChange={onChange}
                                />
                            );
                        }
                        return null;
                    }))}
            </>
        </Category>
    );
});
