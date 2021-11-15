import React, { useRef, useState } from 'react';
import cn from 'classnames';
import ReactResizeDetector from 'react-resize-detector';
import AceEditor from 'react-ace';
import { useStore } from 'Options/stores/useStore';
import { theme } from 'Common/styles';
import { reactTranslator } from 'Common/translators/reactTranslator';

import styles from 'Options/components/Filters/Editor/Editor.module.pcss';

import 'ace-builds/src-noconflict/ext-searchbox';
import 'ace-builds/src-noconflict/theme-textmate';
import './mode-adguard';

export const Editor = () => {
    const name = 'editor';
    const editorRef = useRef<AceEditor>(null);
    const { optionsStore } = useStore();
    const { rawUserRules, setRawUserRules } = optionsStore;
    const [text, setText] = useState(rawUserRules.join('\n'));

    const onChange = (value: string): void => {
        setText(value);
    };

    const onSave = () => {
        setRawUserRules(text.split('\n').filter(Boolean));
    };

    const SIZE_STORAGE_KEY = `${name}_editor-size`;

    const DEFAULT_EDITOR_SIZE = {
        width: '100%',
        height: '300px',
    };

    let editorSize = DEFAULT_EDITOR_SIZE;

    const editorStorageSize = localStorage.getItem(SIZE_STORAGE_KEY);

    if (editorStorageSize) {
        try {
            editorSize = JSON.parse(editorStorageSize);
        } catch (e) {
            editorSize = DEFAULT_EDITOR_SIZE;
        }
    }

    const editorStyles = {
        width: editorSize.width,
        height: editorSize.height,
    };

    const onResize = (width: number | undefined, height: number | undefined) => {
        if (!width || !height) {
            return;
        }

        localStorage.setItem(SIZE_STORAGE_KEY, JSON.stringify({ width, height }));
        editorRef.current?.editor.resize();
    };

    return (
        <div className={styles.container} style={editorStyles}>
            <AceEditor
                ref={editorRef}
                width="100%"
                height="100%"
                mode="adguard"
                theme="textmate"
                name={name}
                showGutter={false}
                showPrintMargin={false}
                editorProps={{ $blockScrolling: true }}
                value={text}
                onChange={onChange}
                className={styles.editor}
                onLoad={(editor) => {
                    const offset = 8;
                    editor.renderer.setPadding(offset);
                    editor.renderer.setScrollMargin(offset, offset, 0, 0);
                }}
            />
            <ReactResizeDetector
                skipOnMount
                handleWidth
                handleHeight
                onResize={onResize}
            />
            <div className={styles.controls}>
                <button
                    className={cn(theme.button.middle, theme.button.green)}
                    type="button"
                    onClick={onSave}
                >
                    {reactTranslator.getMessage('options_editor_save')}
                </button>
            </div>
        </div>
    );
};
