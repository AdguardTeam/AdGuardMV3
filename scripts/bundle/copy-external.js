/* eslint-disable no-await-in-loop,no-restricted-syntax */
import cpy from 'cpy';

export const copyExternals = async () => {
    const paths = [
        {
            from: [
                'node_modules/@adguard/scriptlets/dist/redirects.yml',
            ],
            to: 'src/assets/libs/scriptlets',
        },
        {
            from: 'node_modules/@adguard/scriptlets/dist/redirect-files/*',
            to: 'src/web-accessible-resources/redirects',
        },
    ];

    for (const path of paths) {
        await cpy(path.from, path.to, path.options);
    }
};
