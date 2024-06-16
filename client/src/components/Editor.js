import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import { Socket } from 'socket.io-client';
import ACTIONS from '../Actions';

const Editor = ({socketRef,id,onCodeChange}) => {
  const editorRef = useRef(null);

  useEffect(() => {
    console.log('Initializing Codemirror...');
    
    async function init() {
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById('realtimeEditor'),
        {
          mode: { name: 'javascript', json: true },
          theme: 'dracula',
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );  

      editorRef.current.on('change', (instance,changes) => {
        console.log('Editor content:', changes);

        const {origin} = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if(origin !== 'setValue'){
          socketRef.current.emit(ACTIONS.CODE_CHANGE,{
            id,
            code,        
          });
        }
      });

      

      // editorRef.current.setValue('//start coding\nconsole.log("hello")');
      // editorRef.current.setValue('console.log("hello dhaval")');
    }
    
    init();
  }, []);

  useEffect(()=>{
    if(socketRef.current){
      socketRef.current.on(ACTIONS.CODE_CHANGE,({code,user1})=>{
        console.log("receiving" , code)
        if(code!==null){
          editorRef.current.setValue(code);
        }
      });
    }
    
    return () =>{
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    }
  },[socketRef.current]);

  return (
    <div> 
      <textarea id="realtimeEditor"></textarea>
    </div>
  );
};

export default Editor;
