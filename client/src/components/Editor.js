import React, { useEffect, useRef, useState } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Actions';
import gsap from 'gsap';

const Editor = ({ socketRef, id, onCodeChange }) => {
  const editorRef = useRef(null);
  const [output, setOutput] = useState('');

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

      editorRef.current.on('change', (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== 'setValue') {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            id,
            code,
          });
        }
      });

      editorRef.current.setValue('// Start coding\nconsole.log("Hello, World!")');
      editorRef.current.setSize(null, '100%');

      // Animate editor appearance
      gsap.from(editorRef.current.getWrapperElement(), {
        opacity: 0,
        y: -50,
        duration: 1,
        ease: 'power3.out',
      });
    }

    init();
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }

    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  const runCode = () => {
    const code = editorRef.current.getValue();
    let output = '';

    // Button click animation
    gsap.to('.runButton', { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1 });

    const originalLog = console.log;
    console.log = (...args) => {
        output += args.map(arg => {
            if (typeof arg === 'object') {
                return JSON.stringify(arg, null, 2); // Pretty-print JSON objects
            }
            return String(arg);
        }).join(' ') + '\n';
    };

    try {
        new Function(code)();
        setOutput(output || 'No output');
    } catch (error) {
        setOutput(`Error: ${error.message}`);
    } finally {
        console.log = originalLog;
    }
};


  return (
    <div style={styles.container}>
      <div style={styles.editorContainer}>
        <textarea id="realtimeEditor" style={styles.textarea}></textarea>
      </div>
      <div style={styles.bottomContainer}>
        <div style={styles.buttonContainer}>
          <button
            onClick={runCode}
            className="runButton"
            style={styles.runButton}
            onMouseEnter={() => gsap.to('.runButton', { backgroundColor: '#1F8A9E', duration: 0.3 })}
            onMouseLeave={() => gsap.to('.runButton', { backgroundColor: '#2E99B0', duration: 0.3 })}
          >
            Run
          </button>
          <button
            style={styles.languageButton}
            onMouseEnter={() => gsap.to('.languageButton', { backgroundColor: '#101437', duration: 0.3 })}
            onMouseLeave={() => gsap.to('.languageButton', { backgroundColor: '#161E54', duration: 0.3 })}
          >
            Language: JavaScript
          </button>
        </div>
        <div style={styles.outputContainer}>
          <h3 style={styles.outputHeader}>Output:</h3>
          <pre style={styles.output}>{output}</pre>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: 'linear-gradient(135deg, #1C1E24, #282c34)',
    color: '#ffffff',
    fontFamily: 'Arial, sans-serif',
    overflow: 'hidden',
  },
  editorContainer: {
    flex: '1',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
    backgroundColor: '#1E1E1E',
  },
  textarea: {
    width: '100%',
    height: '100%',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    color: 'white',
    fontFamily: 'monospace',
    fontSize: '14px',
  },
  bottomContainer: {
    height: '30%',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    backgroundColor: '#1A1A1D',
    borderTop: '1px solid #2E2E2E',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  runButton: {
    marginTop: '10px',
    padding: '12px 24px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#2E99B0',
    border: 'none',
    color: 'whitesmoke',
    borderRadius: '8px',
    transition: 'background-color 0.3s',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
  },
  languageButton: {
    marginTop: '10px',
    padding: '12px 24px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#161E54',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    transition: 'background-color 0.3s',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
  },
  outputContainer: {
    marginTop: '20px',
    border: '1px solid #444',
    padding: '15px',
    borderRadius: '8px',
    flexGrow: 1,
    overflowY: 'auto',
    backgroundColor: '#000000',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
  },
  outputHeader: {
    margin: 0,
    fontSize: '18px',
  },
  output: {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    fontSize: '14px',
    color: '#61dafb',
  },
};

export default Editor;
