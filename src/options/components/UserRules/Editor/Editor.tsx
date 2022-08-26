import React, { useRef, useState, useEffect } from 'react';
import cn from 'classnames';
import ReactResizeDetector from 'react-resize-detector';
import AceEditor from 'react-ace';
import { Ace, Range } from 'ace-builds';
import { observer } from 'mobx-react';

import { useStore } from 'Options/stores/useStore';
import { theme } from 'Common/styles';
import { reactTranslator } from 'Common/translators/reactTranslator';
import { useNotifyDynamicRulesLimitsError } from 'Options/hooks/useNotifyDynamicRulesLimitError';

import styles from './Editor.module.pcss';

import 'ace-builds/src-noconflict/ext-searchbox';
import 'ace-builds/src-noconflict/theme-textmate';
import 'Common/editor/mode-adguard';

const MASK_COMMENT = '!';

export const Editor = observer(() => {
    const { optionsStore } = useStore();
    const { error } = optionsStore;

    const name = 'editor';
    const editorRef = useRef<AceEditor>(null);
    const { userRules, setUserRules, closeEditor } = optionsStore;
    const [text, setText] = useState(userRules);

    const checkAndNotifyDynamicRulesError = useNotifyDynamicRulesLimitsError();

    useEffect(() => {
        setText(userRules);
        optionsStore.resetError();
    }, [userRules]);

    const onChange = (value: string): void => {
        setText(value);
    };

    const onSave = async () => {
        const err = await setUserRules(text);
        checkAndNotifyDynamicRulesError(err);
    };

    const onCancel = () => {
        closeEditor();
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

    const onFocus = () => {
        optionsStore.resetError();
    };

    const shortcuts = [
        {
            name: 'save',
            bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
            exec: (editor: Ace.Editor) => {
                setUserRules(editor.getValue());
            },
        },
        {
            name: 'cancel',
            bindKey: { win: 'Esc', mac: 'Esc' },
            exec: onCancel,
        },
        {
            name: 'togglecomment',
            bindKey: { win: 'Ctrl-/', mac: 'Command-/' },
            exec: (editor: Ace.Editor) => {
                const selection = editor.getSelection();
                const ranges = selection.getAllRanges();

                const rowsSelected = ranges
                    .map((range: Ace.Range) => {
                        const [start, end] = [range.start.row, range.end.row];
                        return Array.from({ length: end - start + 1 }, (_, idx) => idx + start);
                    })
                    .flat();

                const allRowsCommented = rowsSelected.every((row: number) => {
                    const rowLine = editor.session.getLine(row);
                    return rowLine.trim().startsWith(MASK_COMMENT);
                });

                rowsSelected.forEach((row: number) => {
                    const rawLine = editor.session.getLine(row);
                    // if all lines start with comment mark we remove it
                    if (allRowsCommented) {
                        const lineWithRemovedComment = rawLine.replace(MASK_COMMENT, '');
                        editor.session.replace(new Range(row, 0, row, rawLine.length), lineWithRemovedComment);
                        // otherwise we add it
                    } else {
                        editor.session.insert({ row, column: 0 }, MASK_COMMENT);
                    }
                });
            },
        },
    ];

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
                className={cn(styles.editor, 'editor')}
                onLoad={(editor) => {
                    const offset = 8;
                    editor.renderer.setPadding(offset);
                    editor.renderer.setScrollMargin(offset, offset, 0, 0);
                }}
                onFocus={onFocus}
                commands={shortcuts}
                fontSize="0.87rem"
            />
            <ReactResizeDetector
                skipOnMount
                handleWidth
                handleHeight
                onResize={onResize}
            />
            {error && (
                <div className={theme.common.error}>
                    {error}
                </div>
            )}
            <div className={styles.controls}>
                <button
                    className={cn(theme.button.middle, theme.button.green, styles.btnLeft)}
                    type="button"
                    disabled={text === userRules}
                    onClick={onSave}
                >
                    {reactTranslator.getMessage('options_editor_save')}
                </button>
                <button
                    className={cn(theme.button.middle, theme.button.red)}
                    type="button"
                    onClick={onCancel}
                >
                    {reactTranslator.getMessage('options_editor_cancel')}
                </button>
            </div>
        </div>
    );
});
