import React, { useContext } from 'react';
import AceEditor from 'react-ace';
import cn from 'classnames';

import { rootStore } from 'Options/stores';

import styles from '../Editor/Editor.module.pcss';

import 'ace-builds/src-noconflict/ext-searchbox';
import 'ace-builds/src-noconflict/theme-textmate';
import 'Common/editor/mode-adguard';

interface UserRuleEditorProps {
    ruleText: string;
    onChange: (value: string) => void;
    mod?: string;
}

const EDITOR_WIDTH = '335px';
const EDITOR_HEIGHT = '100px';

export const UserRuleEditor = ({ ruleText, onChange, mod }: UserRuleEditorProps) => {
    const { optionsStore } = useContext(rootStore);

    const editorSize = {
        width: EDITOR_WIDTH,
        height: EDITOR_HEIGHT,
    };

    const onFocus = () => {
        optionsStore.resetError();
    };

    const containerClassName = cn(styles.container, {
        [styles.modal]: mod === 'modal',
    });

    return (
        <div className={containerClassName} style={editorSize}>
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
                fontSize="1rem"
            />
        </div>
    );
};

UserRuleEditor.defaultProps = {
    mod: '',
};
