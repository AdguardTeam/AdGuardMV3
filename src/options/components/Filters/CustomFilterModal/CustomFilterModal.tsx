/* eslint-disable @typescript-eslint/no-shadow */
import React, { useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react';

import { Modal } from 'Common/components/Modal';
import { theme } from 'Common/styles';
import { log } from 'Common/logger';
import { translator } from 'Common/translators/translator';
import { Icon, IconId } from 'Common/components/ui';
import { rootStore } from 'Options/stores';
import { STEPS } from 'Options/stores/CustomFilterModalStore';
import { AddCustomFilter } from 'Options/components/Filters/CustomFilterModal/AddCustomFilter';
import { AddCustomFilterConfirm } from 'Options/components/Filters/CustomFilterModal/AddCustomFilterConfirm';
import { RemoveCustomFilter } from 'Options/components/Filters/CustomFilterModal/RemoveCustomFilter';
import { FilterInfo, Filter } from 'Common/constants/common';
import { reactTranslator } from 'Common/translators/reactTranslator';

type CustomFilterModalProps = {
    isOpen: boolean,
    closeHandler: () => void,
    urlToSubscribe: string,
    setUrlToSubscribe: (url: string) => void,
    initialTitle: string | null,
};

export const CustomFilterModal = observer(({
    isOpen,
    closeHandler,
    urlToSubscribe,
    setUrlToSubscribe,
    initialTitle,
}: CustomFilterModalProps) => {
    const {
        settingsStore,
        customFilterModalStore,
        uiStore,
    } = useContext(rootStore);

    const {
        filterIdInModal,
        currentStep,
        switchToAddCustomFilterConfirmStep,
        switchToSaveChangesStep,
        switchToConfirmRemoveStep,
        openRemoveCustomFilterModal,
    } = customFilterModalStore;

    const [filterInfo, setFilterInfo] = useState<FilterInfo | null>(null);

    const [filterContent, setFilterContent] = useState<string | null>(null);

    const [currentFilter, setCurrentFilter] = useState<Filter | null>(null);

    const [filterTitle, setFilterTitle] = useState(filterInfo?.title || '');

    const [addCustomFilterError, setAddCustomFilterError] = useState('');

    const onCancelAddCustomModal = () => {
        closeHandler();
    };

    const onSaveCustomFilter = async () => {
        if (filterContent && filterInfo) {
            try {
                await settingsStore.addCustomFilterByContent(
                    filterContent, filterTitle, urlToSubscribe,
                );
                const message = translator.getMessage(
                    'options_custom_filter_add_notification',
                    { name: filterTitle },
                );
                uiStore.addNotification(message);
            } catch (e) {
                log.error(e);
            }
        } else {
            throw new Error('Save custom modal requires url or filter content');
        }
        closeHandler();
    };

    const openConfirmModal = () => {
        switchToConfirmRemoveStep();
    };

    const onRemoveCustomFilter = async () => {
        if (filterIdInModal) {
            await settingsStore.removeCustomFilterById(filterIdInModal);
        } else {
            throw new Error('Provide filter id in order to remove filter');
        }
    };

    const onAddCustomFilterError = (error: string) => {
        if (error) {
            setAddCustomFilterError(error);
            throw new Error(error);
        } else {
            setAddCustomFilterError('');
        }
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

    useEffect(() => {
        if (filterIdInModal) {
            const filter = settingsStore.getFilterById(filterIdInModal);

            if (!filter) {
                throw new Error('Filter should be found');
            }

            setCurrentFilter(filter);
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
            icon: addCustomFilterError ? IconId.WARNING : null,
            title: addCustomFilterError
                ? translator.getMessage('options_custom_filter_modal_retry_title')
                : translator.getMessage('options_custom_filter_modal_add_title'),
            input: false,
            component: () => (
                <AddCustomFilter
                    initialTitle={initialTitle}
                    urlToSubscribe={urlToSubscribe}
                    setUrlToSubscribe={setUrlToSubscribe}
                    addCustomFilterError={addCustomFilterError}
                    onError={onAddCustomFilterError}
                    onSuccess={onAddCustomFilterSuccess}
                />
            ),
        },
        [STEPS.ADD_CUSTOM_FILTER_CONFIRM]: {
            icon: null,
            title: translator.getMessage('options_custom_filter_modal_add_title'),
            input: true,
            component: () => (
                <AddCustomFilterConfirm
                    title={filterTitle}
                    description={filterInfo?.description || ''}
                    onCancel={onCancelAddCustomModal}
                    onSave={onSaveCustomFilter}
                />
            ),
        },
        [STEPS.REMOVE_CUSTOM_FILTER]: {
            icon: null,
            title: translator.getMessage('options_custom_filter_modal_edit_title'),
            input: false,
            component: () => {
                if (filterIdInModal) {
                    return (
                        <>
                            <RemoveCustomFilter
                                title={filterTitle}
                                description={currentFilter?.description || ''}
                                onChange={onChangeTitle}
                                openConfirmModal={openConfirmModal}
                                onSave={onSaveTitle}
                            />
                        </>
                    );
                }
                return null;
            },
        },
        [STEPS.CONFIRM_REMOVE_FILTER]: {
            icon: null,
            title: translator.getMessage('options_custom_filter_modal_removed'),
            input: false,
            component: () => {
                if (filterIdInModal) {
                    return (
                        <>
                            <div className={theme.modal.description}>
                                {translator.getMessage('options_custom_filter_modal_removed_desc')}
                            </div>
                            <div className={theme.modal.footer}>
                                <button
                                    className={cn(
                                        theme.button.middle,
                                        theme.button.green,
                                        theme.modal.leftBtn,
                                    )}
                                    type="button"
                                    onClick={() => openRemoveCustomFilterModal(filterIdInModal)}
                                >
                                    {translator.getMessage('options_custom_filter_modal_confirm_cancel_button')}
                                </button>
                                <button
                                    type="button"
                                    className={cn(theme.button.middle, theme.button.red)}
                                    onClick={onRemoveCustomFilter}
                                >
                                    {translator.getMessage('options_custom_filter_modal_remove_button')}
                                </button>
                            </div>
                        </>
                    );
                }
                return null;
            },
        },
        [STEPS.SAVE_CHANGES]: {
            icon: null,
            title: translator.getMessage('options_custom_filter_modal_save_changes'),
            input: false,
            component: () => (
                <div className={theme.modal.footer}>
                    <button
                        className={cn(
                            theme.button.middle,
                            theme.button.green,
                            theme.modal.leftBtn,
                        )}
                        type="button"
                        onClick={onSaveTitle}
                    >
                        {translator.getMessage('options_custom_filter_modal_confirm_save_button')}
                    </button>
                    <button
                        type="button"
                        className={cn(theme.button.middle, theme.button.red)}
                        onClick={closeHandler}
                    >
                        {translator.getMessage('options_custom_filter_modal_confirm_cancel_button')}
                    </button>
                </div>
            ),
        },
    };

    const step = stepsMap[currentStep];

    const handleClose = () => {
        if (
            currentStep === STEPS.REMOVE_CUSTOM_FILTER
            && currentFilter?.title !== filterTitle
            && filterTitle.length > 0
        ) {
            return switchToSaveChangesStep();
        }
        setAddCustomFilterError('');
        return closeHandler();
    };

    return (
        <Modal
            isOpen={isOpen}
            handleClose={handleClose}
        >
            <div className={theme.modal.container}>
                <div className={theme.modal.header}>
                    {step.icon && <Icon className={theme.modal.headerIcon} id={step.icon} />}
                    <h1 className={theme.modal.title}>{step.title}</h1>
                </div>
                {step.input
                    && (
                        <div className={theme.modal.itemWrapper}>
                            <div className={theme.modal.label}>
                                {reactTranslator.getMessage('options_custom_filter_add_label_name')}
                            </div>
                            <input
                                className={theme.modal.modalInput}
                                type="text"
                                value={filterTitle}
                                onChange={onChangeTitle}
                            />
                        </div>
                    )}
                {step.component()}
            </div>
        </Modal>
    );
});
