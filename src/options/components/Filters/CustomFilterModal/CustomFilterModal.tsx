/* eslint-disable @typescript-eslint/no-shadow */
import React, { useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import Modal from 'react-modal';
import { observer } from 'mobx-react';

import { log } from 'Common/logger';
import { reactTranslator } from 'Common/translators/reactTranslator';
import { Icon, ICON_ID } from 'Common/components/ui';
import { rootStore } from 'Options/stores';
import { STEPS } from 'Options/stores/CustomFilterModalStore';
import { AddCustomFilter } from 'Options/components/Filters/CustomFilterModal/AddCustomFilter';
import { AddCustomFilterConfirm } from 'Options/components/Filters/CustomFilterModal/AddCustomFilterConfirm';
import { RemoveCustomFilter } from 'Options/components/Filters/CustomFilterModal/RemoveCustomFilter';

import s from './CustomFilterModal.module.pcss';

Modal.setAppElement('#root');

type CustomFilterModalProps = {
    isOpen: boolean,
    closeHandler: (e: React.MouseEvent) => void,
};

export const CustomFilterModal = observer(({ isOpen, closeHandler }: CustomFilterModalProps) => {
    const {
        settingsStore,
        customFilterModalStore,
    } = useContext(rootStore);

    const {
        filterIdInModal,
        currentStep,
        switchToAddCustomFilterStep,
        switchToAddCustomFilterRetryStep,
        switchToAddCustomFilterConfirmStep,
    } = customFilterModalStore;

    const [filterInfo, setFilterInfo] = useState<FilterInfo|null>(null);

    const [filterContent, setFilterContent] = useState<string|null>(null);

    const [filterTitle, setFilterTitle] = useState(filterInfo?.title || '');

    const onCancelAddCustomModal = (e: React.MouseEvent) => {
        closeHandler(e);
    };

    const onSaveCustomFilter = async () => {
        if (filterContent && filterInfo) {
            try {
                await settingsStore.addCustomFilterByContent(filterContent, filterTitle);
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
        setFilterTitle(filterInfo.title);
        // save filter content for next steps
        setFilterContent(filterContent);
        switchToAddCustomFilterConfirmStep();
    };

    const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFilterTitle(value);
    };

    let filter: Filter | null;

    useEffect(() => {
        if (filterIdInModal) {
            filter = settingsStore.getFilterById(filterIdInModal);

            if (!filter) {
                throw new Error('Filter should be found');
            }

            setFilterTitle(filter.title);
        }
    }, [filterIdInModal]);

    const onSaveTitle = async () => {
        if (filterIdInModal) {
            await settingsStore.updateFilterTitle(filterIdInModal, filterTitle);
        } else {
            throw new Error('Filter should be found');
        }
    };

    const stepsMap = {
        [STEPS.ADD_CUSTOM_FILTER]: {
            icon: null,
            title: reactTranslator.getMessage('options_custom_filter_modal_add_title'),
            component: () => (
                <AddCustomFilter
                    onError={onAddCustomFilterError}
                    onSuccess={onAddCustomFilterSuccess}
                />
            ),
        },
        [STEPS.ADD_CUSTOM_FILTER_CONFIRM]: {
            icon: null,
            title: filterInfo?.title,
            component: () => (
                <AddCustomFilterConfirm
                    description={filterInfo?.description || ''}
                    onCancel={onCancelAddCustomModal}
                    onSave={onSaveCustomFilter}
                />
            ),
        },
        [STEPS.ADD_CUSTOM_FILTER_RETRY]: {
            icon: ICON_ID.WARNING,
            title: reactTranslator.getMessage('options_custom_filter_modal_retry_title'),
            component: () => (
                <>
                    <div className={s.description}>
                        {reactTranslator.getMessage('options_custom_filter_modal_retry_description')}
                    </div>
                    <div className={cn(s.buttonsGroup, s.center)}>
                        <button
                            type="button"
                            className={s.btnSave}
                            onClick={switchToAddCustomFilterStep}
                        >
                            {reactTranslator.getMessage('options_custom_filter_modal_retry_button')}
                        </button>
                    </div>
                </>
            ),
        },
        [STEPS.REMOVE_CUSTOM_FILTER]: {
            icon: null,
            title: reactTranslator.getMessage('options_custom_filter_modal_add_title'),
            component: () => {
                if (filterIdInModal) {
                    return (
                        <RemoveCustomFilter
                            title={filterTitle}
                            description={filter?.description || ''}
                            onChange={onChangeTitle}
                            onRemove={onRemoveCustomFilter}
                            onSave={onSaveTitle}
                        />
                    );
                }
                return null;
            },
        },
    };

    const step = stepsMap[currentStep];

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeHandler}
            className={s.modal}
            bodyOpenClassName="bodyOpenClassName"
            overlayClassName={{
                base: s.overlay,
                afterOpen: 'overlay--after-open',
                beforeClose: 'overlay--before-close',
            }}
        >
            <div className={s.contentContainer}>
                <div className={s.header}>
                    {step.icon && <Icon className={s.icon} id={step.icon} />}
                    { step.title === filterInfo?.title
                        ? (
                            <input
                                className={s.modalInput}
                                type="text"
                                value={filterTitle}
                                onChange={onChangeTitle}
                            />
                        )
                        : <h1 className={s.heading}>{step.title}</h1>}
                </div>
                <button onClick={closeHandler} className={s.closeIcon} type="button">
                    <Icon id={ICON_ID.CROSS} />
                </button>
                {step.component()}
            </div>
        </Modal>
    );
});
