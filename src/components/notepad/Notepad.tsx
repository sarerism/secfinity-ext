import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import "@uiw/react-md-editor/markdown-editor.css";
import PersistedState from 'use-persisted-state';

const useNotepadState = PersistedState<string | string>('notepad');
const useDarkModeState = PersistedState<boolean>('dark_mode');

const NOTEPAD = () => {
    const [ value, setValue ] = useNotepadState( '' );
    const [ darkMode ] = useDarkModeState( false );

    return (
        <div className='container' data-color-mode={darkMode ? 'dark' : 'light'} style={{ backgroundColor: darkMode ? '#0d1117' : '#fff', padding: '10px', borderRadius: '5px' }}>
            <MDEditor
                data-color-mode={darkMode ? 'dark' : 'light'}
                textareaProps={{
                    placeholder: 'This is an offline markdown editor to help you take some small notes (data is kept in your browser localstorage)'
                }}
                value={value || ''}
                onChange={setValue}
                height={500}
            />
        </div>
    );

};

export default NOTEPAD;
