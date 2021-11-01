// TODO image constructor is not available in the service worker
// Wait until this bug resolution https://bugs.chromium.org/p/chromium/issues/detail?id=1168477
// Remove if bug is not resolved
class IconsCache {
    cache = new Map();

    /**
     * Download image and convert it to ImageData
     *
     * @param {Number} size - icon size in px
     * @param {String} url - icon url
     * @returns {ImageData}
     */
    loadImageData = (size: number, url: string) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                document.documentElement.appendChild(canvas);
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext('2d')!;
                ctx.drawImage(img, 0, 0);
                const data = ctx.getImageData(0, 0, size, size);
                canvas.remove();
                resolve(data);
            };
            img.onerror = reject;
        });
    };

    /**
     * Get ImageData for specific url
     *
     * @param {Number} size - icon size in px
     * @param {String} url - icon url
     * @returns {[size: Number, imageData: ImageData]} - key-value entry for browserAction.setIcon
     * 'imageData' property
     */
    getImageData = async (size: number, url: string) => {
        const imageData = this.cache.get(url);
        if (!imageData) {
            const data = await this.loadImageData(size, url);
            this.cache.set(url, data);
            return [size, data];
        }

        return [size, imageData];
    };

    /**
     * Match urls from browserAction.setIcon 'path' property with cached ImageData values
     * and return 'imageData' object for this action.
     *
     * see: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/browserAction/setIcon
     *
     * @param {Object} path - browserAction.setIcon details 'path' property
     * @returns {Object} - browserAction.setIcon details 'imageData' property
     */
    public getIconImageData = async (path: { [key: number]: string }) => {
        const imageDataEntriesPromises = Object.entries(path)
            .map(([size, url]) => this.getImageData(Number(size), url));

        const imageDataEntries = await Promise.all(imageDataEntriesPromises);

        return Object.fromEntries(imageDataEntries);
    };
}

export const iconsCache = new IconsCache();
