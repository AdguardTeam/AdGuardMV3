import { assistant } from './assistant';

interface CustomNodeJsGlobal extends NodeJS.Global {
    isAssistantInitiated: boolean;
}

declare const global: CustomNodeJsGlobal;

// Init assistant only once
if (!global.isAssistantInitiated) {
    assistant.init();
    global.isAssistantInitiated = true;
}
