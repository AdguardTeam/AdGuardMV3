import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import cn from 'classnames';

import { rootStore } from '../../stores';
import { containsIgnoreCase, findChunks } from '../../../common/helpers';
import { theme } from '../../../common/styles';

interface HighlightSearchProps {
    str: string,
}

export const HighlightSearch = observer(({ str }: HighlightSearchProps) => {
    const { searchStore: { searchValue } } = useContext(rootStore);

    const renderStr = () => {
        const strChunks = findChunks(str, searchValue);

        const displayName = strChunks.map((chunk, i) => {
            const isSearchMatch = chunk.toLowerCase() === searchValue.toLowerCase();
            const chunkClassName = cn({
                [theme.common.highlight]: isSearchMatch,
            });
            return (
                <span
                    key={i} // eslint-disable-line react/no-array-index-key
                    className={chunkClassName}
                >
                    {chunk}
                </span>
            );
        });

        return displayName;
    };

    return (
        <>
            {
                searchValue.length > 0 && containsIgnoreCase(str, searchValue)
                    ? renderStr()
                    : str
            }
        </>
    );
});
