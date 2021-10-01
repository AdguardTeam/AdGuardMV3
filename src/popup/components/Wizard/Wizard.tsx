import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import cn from 'classnames';

import { Icon } from 'Common/components/ui';
import { reactTranslator } from 'Common/translators/reactTranslator';
import { theme } from 'Common/styles';
import { rootStore } from '../../stores';

import styles from './wizard.module.pcss';

export const Wizard = observer(() => {
    const { wizardStore } = useContext(rootStore);
    const {
        step,
        stepInfo,
        isLastStep,
        skipWizard,
        setNextStep,
        buttonTextKey,
    } = wizardStore;

    // TODO add learn more link handler
    return (
        <section className={styles.container}>
            <div className={styles.header}>
                <button type="button" className={styles.link}>
                    {reactTranslator.getMessage('popup_learn_more_link')}
                </button>
                <button
                    type="button"
                    className={styles.link}
                    onClick={skipWizard}
                >
                    {reactTranslator.getMessage('popup_skip_wizard')}
                </button>
            </div>
            <div className={styles.icon}>
                <Icon id={stepInfo.icon} />
            </div>
            <div className={cn(styles.info, styles.main)}>
                {`${step}.`}
                &nbsp;
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
        </section>
    );
});
