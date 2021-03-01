/* eslint-disable @typescript-eslint/no-shadow */
import React, { useContext, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { observer } from 'mobx-react';

import { log } from 'Common/logger';
import { rootStore } from '../../../stores';
import { AddCustomFilter } from './AddCustomFilter';
import { AddCustomFilterConfirm } from './AddCustomFilterConfirm';

import s from './CustomFilterModal.module.pcss';

Modal.setAppElement('#root');

type CustomFilterModalProps = {
    isOpen: boolean,
    closeHandler: () => void,
};

const customStyles: ReactModal.Styles = {
    overlay: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, .1)',
        width: '100%',
        height: '100%',
        zIndex: 7,
    },
    content: {
        border: 0,
        width: '560px',
        height: 'auto',
        position: 'relative',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        padding: '30px',
        overflow: 'auto',
    },
};

export enum STEPS {
    ADD_CUSTOM_FILTER = 'ADD_CUSTOM_FILTER',
    ADD_CUSTOM_FILTER_CONFIRM = 'ADD_CUSTOM_FILTER_CONFIRM',
    ADD_CUSTOM_RETRY = 'ADD_CUSTOM_RETRY',
    REMOVE_CUSTOM = 'REMOVE_CUSTOM',
}

export const CustomFilterModal = observer(({ isOpen, closeHandler }: CustomFilterModalProps) => {
    const { settingsStore } = useContext(rootStore);

    const [currentStep, setCurrentStep] = useState(STEPS.ADD_CUSTOM_FILTER);

    useEffect(() => {
        setCurrentStep(settingsStore.filterIdInCustomModal
            ? STEPS.REMOVE_CUSTOM
            : STEPS.ADD_CUSTOM_FILTER);
    }, [settingsStore.filterIdInCustomModal]);

    console.log(currentStep);

    const [filterInfo, setFilterInfo] = useState<FilterInfo|null>(null);

    const [filterContent, setFilterContent] = useState<string|null>(null);

    const onCancelAddCustomModal = () => {
        closeHandler();
    };

    const resetModalToInit = () => {
        setCurrentStep(STEPS.ADD_CUSTOM_FILTER);
        setFilterInfo(null);
        setFilterContent(null);
    };

    const onSaveCustomModal = async () => {
        if (filterContent && filterInfo) {
            try {
                await settingsStore.addCustomFilterByContent(filterContent, filterInfo.title);
            } catch (e) {
                log.error(e);
            }
        } else {
            throw new Error('Save custom modal requires url or filter content');
        }
        // close modal on success
        closeHandler();
        resetModalToInit();
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onAddCustomFilterError = (error: string) => {
        // FIXME display error
        setCurrentStep(STEPS.ADD_CUSTOM_RETRY);
        // setError(error);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onAddCustomFilterSuccess = (filterInfo: FilterInfo, filterContent: string) => {
        setFilterInfo(filterInfo);
        // FIXME save file content for next actions
        setFilterContent(filterContent);
        setCurrentStep(STEPS.ADD_CUSTOM_FILTER_CONFIRM);
    };

    const stepsMap = {
        [STEPS.ADD_CUSTOM_FILTER]: {
            title: 'Add a custom filter',
            component: () => (
                <AddCustomFilter
                    onError={onAddCustomFilterError}
                    onSuccess={onAddCustomFilterSuccess}
                />
            ),
        },
        [STEPS.ADD_CUSTOM_FILTER_CONFIRM]: {
            title: filterInfo?.title,
            component: () => (
                <AddCustomFilterConfirm
                    description={filterInfo?.description || null}
                    onCancel={onCancelAddCustomModal}
                    onSave={onSaveCustomModal}
                />
            ),
        },
        [STEPS.ADD_CUSTOM_RETRY]: {
            title: 'Retry',
            component: () => (<div>TODO retry</div>),
        },
        [STEPS.REMOVE_CUSTOM]: {
            title: 'Are you sure?',
            component: () => (<div>TODO remove</div>),
        },
    };

    const renderContent = () => {
        const step = stepsMap[currentStep];
        return (
            <>
                <div className={s.title}>{step.title}</div>
                {step.component()}
            </>
        );
    };

    // FIXME translate buttons
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeHandler}
            style={customStyles}
        >
            <button type="button" onClick={closeHandler}>close</button>
            {renderContent()}
        </Modal>
    );
});
