/* eslint-disable @typescript-eslint/no-shadow */
import React, { useContext, useState } from 'react';
import Modal from 'react-modal';
import { observer } from 'mobx-react';

import { log } from 'Common/logger';
import { reactTranslator } from 'Common/translators/reactTranslator';
import { rootStore } from '../../../stores';
import { STEPS } from '../../../stores/CustomFilterModalStore';
import { AddCustomFilter } from './AddCustomFilter';
import { AddCustomFilterConfirm } from './AddCustomFilterConfirm';
import { RemoveCustomFilter } from './RemoveCustomFilter';

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

export const CustomFilterModal = observer(({ isOpen, closeHandler }: CustomFilterModalProps) => {
    const {
        settingsStore,
        customFilterModalStore,
    } = useContext(rootStore);

    const {
        filterIdInModal,
        currentStep,
        switchToAddCustomFilterRetryStep,
        switchToAddCustomFilterConfirmStep,
    } = customFilterModalStore;

    const [filterInfo, setFilterInfo] = useState<FilterInfo|null>(null);

    const [filterContent, setFilterContent] = useState<string|null>(null);

    const onCancelAddCustomModal = () => {
        closeHandler();
    };

    const onSaveCustomFilter = async () => {
        if (filterContent && filterInfo) {
            try {
                await settingsStore.addCustomFilterByContent(filterContent, filterInfo.title);
            } catch (e) {
                log.error(e);
            }
        } else {
            throw new Error('Save custom modal requires url or filter content');
        }
    };

    const onRemoveCustomFilter = async () => {
        if (filterIdInModal) {
            await settingsStore.removeCustomFilterById(filterIdInModal);
        } else {
            throw new Error('Provide filter id in order to remove filter');
        }
    };

    // TODO display error screen with retry button
    const onAddCustomFilterError = (error: string) => {
        // eslint-disable-next-line no-console
        console.log(error);
        switchToAddCustomFilterRetryStep();
    };

    const onAddCustomFilterSuccess = (filterInfo: FilterInfo, filterContent: string) => {
        setFilterInfo(filterInfo);
        // save filter content for next steps
        setFilterContent(filterContent);
        switchToAddCustomFilterConfirmStep();
    };

    const stepsMap = {
        [STEPS.ADD_CUSTOM_FILTER]: {
            title: reactTranslator.getMessage('options_custom_filter_modal_add_title'),
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
                    onSave={onSaveCustomFilter}
                />
            ),
        },
        [STEPS.ADD_CUSTOM_FILTER_RETRY]: {
            title: 'Retry',
            component: () => (<div>TODO retry</div>),
        },
        [STEPS.REMOVE_CUSTOM_FILTER]: {
            title: reactTranslator.getMessage('options_custom_filter_remove_title'),
            component: () => {
                if (!filterIdInModal) {
                    throw new Error('Filter should be selected');
                }

                const filter = settingsStore.getFilterById(filterIdInModal);

                if (!filter) {
                    throw new Error('Filter should be found');
                }

                return (
                    <RemoveCustomFilter
                        title={filter.title}
                        description={filter.description}
                        onRemove={onRemoveCustomFilter}
                    />
                );
            },
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

    // FIXME replace text button with icon button
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
