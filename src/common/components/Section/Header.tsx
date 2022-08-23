import React, { useRef } from 'react';
import { NavLink } from 'react-router-dom';

import { Icon, IconId } from 'Common/components/ui';
import { translator } from 'Common/translators/translator';

import { Search } from './Search';
import styles from './Section.module.pcss';

interface HeaderProps {
    isOpen: boolean,
    handleBackClick: (e: React.MouseEvent<HTMLAnchorElement>) => void,
    handleSearchClick?: () => void,
    handleCloseSearchClick: () => void,
    handleSearchInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    pageTitle: string,
    searchValue: string,
}

export const Header = ({
    isOpen,
    searchValue,
    handleBackClick,
    handleSearchClick,
    handleCloseSearchClick,
    handleSearchInputChange,
    pageTitle,
}: HeaderProps) => {
    const ref = useRef(null);

    return (
        <div className={styles.iconGroup}>
            <div className={styles.iconGroupHeading}>
                <NavLink to="/" onClick={handleBackClick}>
                    <Icon id={IconId.ARROW_NAV} />
                </NavLink>
                {isOpen
                    ? (
                        <Search
                            value={searchValue}
                            handleCloseSearchClick={handleCloseSearchClick}
                            handleSearchInputChange={handleSearchInputChange}
                        />
                    ) : (
                        <>
                            <h1 className={styles.heading} ref={ref}>{pageTitle}</h1>
                        </>
                    )}
            </div>
            {!isOpen && (
                <div className={styles.iconsGroup}>
                    {handleSearchClick && (
                        <button
                            type="button"
                            aria-label={translator.getMessage('options_user_magnifier')}
                            onClick={handleSearchClick}
                        >
                            <Icon id={IconId.MAGNIFIER} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

Header.defaultProps = {
    handleSearchClick: undefined,
};
