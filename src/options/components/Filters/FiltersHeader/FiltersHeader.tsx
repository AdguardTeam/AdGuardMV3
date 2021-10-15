import React, { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Icon, ICON_ID } from 'Common/components/ui';
import { FiltersSearch } from 'Options/components/Filters/FiltersSearch';
import { reactTranslator } from 'Common/translators/reactTranslator';
import { TitleTooltip } from 'Common/components/TitleTooltip';

import styles from 'Options/components/Filters/FiltersHeader/FiltersHeader.module.pcss';

export type IProps = {
    isOpen: boolean,
    handleBackClick: () => void,
    handleSearchClick?: () => void,
    handleCloseSearchClick: () => void,
    handleSearchInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    pageTitle: string,
    searchValue: string,
};

export const FilterHeader = ({
    isOpen,
    searchValue,
    handleBackClick,
    handleSearchClick,
    handleCloseSearchClick,
    handleSearchInputChange,
    pageTitle,
}: IProps) => {
    const ref = useRef(null);

    return (
        <div className={styles.iconGroup}>
            <div className={styles.iconGroupHeading}>
                <NavLink to="/" onClick={handleBackClick}>
                    <Icon id={ICON_ID.ARROW_NAV} />
                </NavLink>
                {isOpen
                    ? (
                        <FiltersSearch
                            value={searchValue}
                            handleCloseSearchClick={handleCloseSearchClick}
                            handleSearchInputChange={handleSearchInputChange}
                        />
                    ) : (
                        <>
                            <h1 className={styles.heading} ref={ref}>{pageTitle}</h1>
                            <TitleTooltip ref={ref}>{pageTitle}</TitleTooltip>
                        </>
                    )}
            </div>
            {!isOpen && (
                <div className={styles.iconsGroup}>
                    {handleSearchClick && (
                        <button
                            type="button"
                            aria-label={reactTranslator.getMessage('options_user_magnifier') as string}
                            onClick={handleSearchClick}
                        >
                            <Icon id={ICON_ID.MAGNIFIER} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
