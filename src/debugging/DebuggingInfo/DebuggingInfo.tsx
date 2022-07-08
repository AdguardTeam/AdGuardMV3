import React from 'react';

import { REPO_URL } from 'Common/constants/common';
import { reactTranslator } from 'Common/translators/reactTranslator';

import { DebuggingApp } from '../DebuggingApp';

export const DebuggingInfo = () => {
    // The packed extension manifest has an 'update_url' field
    const isUnpackedExtension = !chrome.runtime.getManifest().update_url;

    return isUnpackedExtension
        ? <DebuggingApp />
        : (
            <p>
                {reactTranslator.getMessage('debugging_info', {
                    'link-to-repo': (s: string) => (
                        <a
                            href={REPO_URL}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <span>
                                {s}
                            </span>
                        </a>
                    ),
                })}
            </p>
        );
};
