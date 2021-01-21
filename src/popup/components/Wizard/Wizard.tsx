import React, { useContext } from 'react';
import { observer } from 'mobx-react';

import { translate } from '../../../common/helpers';
import { Icon } from '../../../common/components/ui/Icon';
import { rootStore } from '../../stores';

import './wizard.pcss';

export const Wizard = observer(() => {
    const { wizardStore } = useContext(rootStore);
    const {
        step,
        stepInfo,
        buttonText,
        isLastStep,
        setNextStep,
        skipWizard,
    } = wizardStore;

    return (
        <section className="wizard__container">
            <div className="wizard__header">
                <button type="button" className="wizard__link">{translate('learn_more')}</button>
                <button
                    type="button"
                    className="wizard__link"
                    onClick={skipWizard}
                >
                    {translate('skip')}
                </button>
            </div>
            <div className="wizard__icon">
                <Icon id={stepInfo.icon} />
            </div>
            <div className="wizard__info wizard__info--main">
                {`${step}.`}
                &nbsp;
                {translate(stepInfo.nameKey)}
            </div>
            <div className="wizard__info wizard__info--description">{translate(stepInfo.descriptionKey)}</div>
            <button
                type="button"
                className="wizard__button"
                onClick={isLastStep ? skipWizard : setNextStep}
            >
                {buttonText}
            </button>
        </section>
    );
});
