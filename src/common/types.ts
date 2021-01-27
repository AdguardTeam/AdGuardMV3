import { MESSAGE_TYPES, STORAGE_KEYS } from 'Common/constants';

export type MessageType = keyof typeof MESSAGE_TYPES;

export type StorageKeysType = keyof typeof STORAGE_KEYS;

export interface Message {
    type: MessageType;
    data: any;
}
