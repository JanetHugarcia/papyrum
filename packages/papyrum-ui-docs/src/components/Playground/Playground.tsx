import * as React from 'react';
import { useState } from 'react';
import { LiveProvider, LiveError, LivePreview } from 'react-live';
import { CodeWrapperStyled, contextDB } from '@papyrum/ui';
import { CodeBar } from '@papyrum/ui';
import copy from 'copy-text-to-clipboard';
import { getHighlight } from '@papyrum/ui';
import Editor from 'react-simple-code-editor';
import { useContext, useEffect } from 'react';

import { 
  WrapperLivePreview,
  EditorWrapper
} from './styled';

export const Playground = ({ code: initialCode, scope, name }) => {
  const { pathname } = location;
  const [ code, setCode ] = useState(initialCode);
  const [ clip, setClip ] = useState(false);
  const [ showCode, setShowCode ] = useState(false);
  const { stateForComponent, setStateForComponent } = useContext(contextDB);
  useEffect(() => {
    if(!stateForComponent[pathname]) {
      stateForComponent[pathname] = [];
      stateForComponent[pathname].push({
        name: name,
        code,
        scope
      });
      setStateForComponent({ ...stateForComponent });
    } else {
      !stateForComponent[pathname]
        .map(({ name }) => name)
        .includes(name) && stateForComponent[pathname].push({
          name: name,
          code,
          scope
        });
    }
  });
  
  const handleClipboard = () => {
    copy(code);
    setClip(true);
    setTimeout(() => setClip(false), 200);
  };
  const propsEditor = {
    value: code,
    onValueChange: code => setCode(code),
    highlight: getHighlight,
    style: {
      fontFamily: 'Fira Code',
      fontSize: 14,
      lineHeight: '24px'
    }
  };
  return(
    <CodeWrapperStyled>
      <LiveProvider code={code} scope={scope}>
        <WrapperLivePreview>
          <LivePreview />
          <LiveError />
        </WrapperLivePreview>
        <CodeBar
          clip={clip}
          code={true}
          handleShowCode={() => {
            setShowCode(!showCode);
          }}
          handleClipboard={handleClipboard}
        />
        {showCode && (
          <EditorWrapper>
            <Editor {...propsEditor} />
          </EditorWrapper>
        )}
      </LiveProvider>
    </CodeWrapperStyled>
  )
};