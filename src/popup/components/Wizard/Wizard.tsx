import React, { useContext } from 'react';
import { observer } from 'mobx-react';

import { Icon } from '../../../common/components/ui/Icon';
import { reactTranslator } from '../../../common/translators/reactTranslator';
import { rootStore } from '../../stores';

import './wizard.pcss';

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
        <section className="wizard__container">
            <div className="wizard__header">
                <button type="button" className="wizard__link">
                    {reactTranslator.getMessage('popup_learn_more_link')}
                </button>
                <button
                    type="button"
                    className="wizard__link"
                    onClick={skipWizard}
                >
                    {reactTranslator.getMessage('popup_skip_wizard')}
                </button>
            </div>
            <div className="wizard__icon">
                <Icon id={stepInfo.icon} />
            </div>
            <div className="wizard__info wizard__info--main">
                {`${step}.`}
                &nbsp;
                {reactTranslator.getMessage(stepInfo.nameKey)}
            </div>
            <div className="wizard__info wizard__info--description">
                {reactTranslator.getMessage(stepInfo.descriptionKey)}
            </div>
            <button
                type="button"
                className="wizard__button"
                onClick={isLastStep ? skipWizard : setNextStep}
            >
                {reactTranslator.getMessage(buttonTextKey)}
            </button>
        </section>
    );
});
