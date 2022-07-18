import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import cn from 'classnames';

import { reactTranslator } from 'Common/translators/reactTranslator';
import { theme } from 'Common/styles';
import { LEARN_MORE } from 'Common/constants/urls';

import { rootStore } from '../../stores';

import styles from './wizard.module.pcss';

export const Wizard = observer(() => {
    const { wizardStore } = useContext(rootStore);
    const {
        stepInfo,
        isLastStep,
        skipWizard,
        setNextStep,
        buttonTextKey,
    } = wizardStore;

    const { icon } = stepInfo;

    const img = icon.toLowerCase().replace('_', '');

    const containerClassName = cn(styles.container, styles[img]);

    return (
        <section className={containerClassName}>
            <div className={styles.header}>
                <a
                    className={styles.link}
                    href={LEARN_MORE}
                    target="_blank"
                    rel="noreferrer"
                >
                    {reactTranslator.getMessage('popup_learn_more_link')}
                </a>
                <button
                    type="button"
                    className={styles.link}
                    onClick={skipWizard}
                >
                    {reactTranslator.getMessage('popup_skip_wizard')}
                </button>
            </div>
            <div className={styles.inner}>
                <div className={cn(styles.info, styles.main)}>
                    {reactTranslator.getMessage(stepInfo.nameKey)}
                </div>
                <div className={cn(styles.info, styles.description)}>
                    {reactTranslator.getMessage(stepInfo.descriptionKey)}
                </div>
                <button
                    type="button"
                    className={cn(theme.common.buttonGreen, styles.button)}
                    onClick={isLastStep ? skipWizard : setNextStep}
                >
                    {reactTranslator.getMessage(buttonTextKey)}
                </button>
            </div>
        </section>
    );
});
