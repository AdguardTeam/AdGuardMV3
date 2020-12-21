const protection_status = document.querySelector('#protection_status');

chrome.runtime.sendMessage({type: POPUP_MESSAGES.getProtectionEnabled}, (response) => {
    const {data} = response;
    protection_status.checked = data[PROTECTION_ENABLED_KEY];
});

protection_status.addEventListener('change', () => {
    chrome.runtime.sendMessage({
            type: POPUP_MESSAGES.setProtectionEnabled, data: {
                [PROTECTION_ENABLED_KEY]: protection_status.checked,
            }
        },
        (response) => {
            console.log('response', response)
        })
})

chrome.runtime.onMessage.addListener((request) => {
    const {type} = request;

    switch (type) {
        case POPUP_MESSAGES.setProtectionEnabled: {
            protection_status.checked = request.data[PROTECTION_ENABLED_KEY];
            return true;
        }
        default:
            return;
    }
});

