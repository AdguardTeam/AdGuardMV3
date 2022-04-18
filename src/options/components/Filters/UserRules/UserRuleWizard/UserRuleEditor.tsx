import React, { useContext } from 'react';
import { rootStore } from 'Options/stores';
import AceEditor from 'react-ace';
import cn from 'classnames';

import styles from '../Editor/Editor.module.pcss';

import 'ace-builds/src-noconflict/ext-searchbox';
import 'ace-builds/src-noconflict/theme-textmate';
import 'Common/editor/mode-adguard';

interface UserRuleEditorProps {
    ruleText: string;
    onChange: (value: string) => void;
}

const EDITOR_WIDTH = '335px';
const EDITOR_HEIGHT = '100px';

export const UserRuleEditor = ({ ruleText, onChange }: UserRuleEditorProps) => {
    const { optionsStore } = useContext(rootStore);

    const editorSize = {
        width: EDITOR_WIDTH,
        height: EDITOR_HEIGHT,
    };

    const onFocus = () => {
        optionsStore.resetError();
    };

    return (
        <div className={cn(styles.container, styles.modal)} style={editorSize}>
            <AceEditor
                width="100%"
                height="100%"
                mode="adguard"
                theme="textmate"
                name="user_rule_editor"
                showGutter={false}
                showPrintMargin={false}
                editorProps={{ $blockScrolling: true }}
                value={ruleText}
                onChange={onChange}
                className={cn(styles.editor, styles.editorUserRules, 'editor')}
                onFocus={onFocus}
                maxLines={1}
            />
        </div>
    );
};
