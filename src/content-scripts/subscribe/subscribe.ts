import { MESSAGE_TYPES } from 'Common/constants/common';
import { sendMessage } from 'Common/helpers';

class Subscribe {
    getSubscriptionParams = (urlParams: string[]) => {
        let title = null;
        let url = null;

        for (let i = 0; i < urlParams.length; i += 1) {
            const parts = urlParams[i].split('=', 2);
            if (parts.length === 2) {
                switch (parts[0]) {
                    case 'title':
                        title = decodeURIComponent(parts[1]);
                        break;
                    case 'location':
                        url = decodeURIComponent(parts[1]);
                        break;
                    default:
                        break;
                }
            }
        }

        return {
            title,
            url,
        };
    };

    onLinkClicked = (e: MouseEvent) => {
        if (e.button === 2) {
            // ignore right-click
            return;
        }

        let { target } = e;
        while (target) {
            if (target instanceof HTMLAnchorElement) {
                break;
            }
            target = (target as Element).parentNode;
        }

        if (!target) {
            return;
        }

        if (target.protocol === 'http:' || target.protocol === 'https:') {
            if (target.host !== 'subscribe.adblockplus.org' || target.pathname !== '/') {
                return;
            }
        } else if (!(/^abp:\/*subscribe\/*\?/i.test(target.href)
            || /^adguard:\/*subscribe\/*\?/i.test(target.href))) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        let urlParams;

        if (target.search) {
            urlParams = target.search.substring(1).replace(/&amp;/g, '&').split('&');
        } else {
            const { href } = target;
            const index = href.indexOf('?');
            urlParams = href.substring(index + 1).replace(/&amp;/g, '&').split('&');
        }

        const subParams = this.getSubscriptionParams(urlParams);
        const url = subParams.url?.trim();

        const title = subParams.title ? (subParams.title).trim() : url;

        if (!url) {
            return;
        }

        sendMessage(MESSAGE_TYPES.ADD_FILTERING_SUBSCRIPTION, { url, title });
    };

    init = () => {
        if (!(document instanceof HTMLDocument)) {
            return;
        }
        document.addEventListener('click', this.onLinkClicked);
    };
}

export const subscribe = new Subscribe();
