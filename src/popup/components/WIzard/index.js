import './index.pcss';
import { useContext } from 'react';
import { observer } from 'mobx-react';

import { translate } from '../../../common/helpers';
import { Icon } from '../../../common/components/ui/Icon';
import { rootStore } from '../../stores';

export const Wizard = observer(() => {
    const { wizardStore } = useContext(rootStore);
    const {
        step, stepName, stepDescription, stepIconId, buttonText, isLastStep,
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
                <Icon id={stepIconId} />
            </div>
            <div className="wizard__info wizard__info--main">
                {`${step}.`}
                &nbsp;
                {stepName}
            </div>
            <div className="wizard__info wizard__info--description">{stepDescription}</div>
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
