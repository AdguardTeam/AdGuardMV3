import React, { ReactNode } from 'react';
import ReactModal from 'react-modal';

import { Icon, IconId } from '../ui';
import { theme } from '../../styles/index';

export type ModalProps = {
    isOpen: boolean,
    handleClose: () => void,
    children: ReactNode,
};

export const Modal = ({ isOpen, handleClose, children }: ModalProps) => {
    ReactModal.setAppElement('#root');

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={handleClose}
            className={theme.modal.modal}
            overlayClassName={theme.modal.overlay}
        >
            <div className={theme.modal.container}>
                <button
                    onClick={handleClose}
                    className={theme.modal.closeIcon}
                    type="button"
                >
                    <Icon id={IconId.CROSS} />
                </button>
                {children}
            </div>
        </ReactModal>
    );
};
