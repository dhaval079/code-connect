import React, { useEffect, useRef, useState } from "react";
import Client from "../components/Client";
import { useNavigate, useLocation, useParams, Navigate } from "react-router-dom";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import ACTIONS from "../Actions";
import toast from "react-hot-toast";
import TypingIndicator from "../components/TypingIndicator";
import './EditorPage.css'
const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { id } = useParams();
  const reactNavigator = useNavigate();
  const [clients, setClients] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [activeUser, setActiveUser] = useState(null); // Add this state
  const [activeUser1, setActiveUser1] = useState(null);
  const typingTimer = useRef(null);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code, user1 }) => {
        console.log("user changing here this is ", user1);
        setActiveUser1(user1);
        clearTimeout(typingTimer.current);
        typingTimer.current = setTimeout(() => {
          setActiveUser1(null);
        }, 3000);
      });
    }
    return () => {
      socketRef.current?.off(ACTIONS.CODE_CHANGE);
      clearTimeout(typingTimer.current);
    };
  }, [socketRef.current]);


  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();

      socketRef.current.on('connect', () => {
        setSocketConnected(true);
        socketRef.current.emit(ACTIONS.JOIN, {
          id,
          user: location.state?.user,
        });
      });

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed try again later");
        reactNavigator("/");
      }
      
      socketRef.current.on(ACTIONS.JOINED, ({ clients, user }) => {
        if (user !== location.state?.user) {
          toast.success(`${user} joined the room`);
        }
        setClients(clients);
      });

        // Update the active user when receiving CODE_CHANGE
        socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code, user }) => {
          console.log("Code : ", code);
          console.log("User Changing : ", user);
          setActiveUser(user);
          clearTimeout(typingTimer.current);
          typingTimer.current = setTimeout(() => {
            setActiveUser(null);
          }, 3000); // Reset active user after 3 seconds of inactivity
        });
      
        socketRef.current.on("connection_error", (err) => {
          handleErrors(err);
        });
        socketRef.current.on("connection_failed", (err) => {
          handleErrors(err);
        });

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, user }) => {
        toast.success(`${user} left the room.`);
        setClients((prev) => prev.filter(client => client.socketId !== socketId));
      });
    };

    

    init();

    return () => {
      if (socketRef.current && socketConnected) {
      socketRef.current?.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      clearTimeout(typingTimer.current);
    }
  }
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code, user1 }) => {
        console.log("user changing here this is ", user1);
        setActiveUser(user1);
        setTimeout(() => {
          setActiveUser();
        }, 3000);
      });
    }
    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE, () => {
        console.log("Socket Off");
      });
    };
  }, [socketRef.current]);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(id);
      toast.success("Copied Room ID");
    } catch (e) {
      toast.error("Failed to copy Room ID");
      console.log(e);
    }
  }

  function leaveRoom() {
    if (window.confirm("Are you sure you want to leave?")) {
      socketRef.current.emit(ACTIONS.LEAVE_ROOM, { id });
      socketRef.current.disconnect();
      reactNavigator("/");
    }
  }

  if (!location.state) {
    return <Navigate to="/" />;
  }
  const currentUser = location.state?.user; // Get the current user

  return (
    <div className="mainWrap" style={styles.mainWrap}>
      <div className="aside" style={styles.aside}>
        <div className="asideInner" style={styles.asideInner}>
          <div className="logo">
            <img className="logoImage" src="/code.png" alt="codesync" />
          </div>
          <div className="container" style={styles.activeContainer}>
            <div className="active-dot" style={styles.activeDot}></div>
            <div className="text"> Active</div>
          </div>
          <div className="clientsList" style={styles.clientsList}>
            {clients.map((client) => (
              <Client 
                key={client.socketId} 
                user={client.user}
                isActive={client.user === activeUser} 
              />
            ))}
          </div>
        </div>
        <TypingIndicator activeUser={activeUser} />
        <button className="btn copyBtn" onClick={copyRoomId} style={styles.copyBtn}>
          Copy Room ID
        </button>
        <button className="btn leaveBtn" onClick={leaveRoom} style={styles.leaveBtn}>
          Leave
        </button>
      </div>
      <div className="editorwrap" style={styles.editorwrap}>
        <Editor 
          socketRef={socketRef} 
          id={id} 
          onCodeChange={(code) => { codeRef.current = code; }}
        />
      </div>
    </div>
  );
};

const styles = {
  mainWrap: {
    display: 'grid',
    gridTemplateColumns: '230px 1fr',
    height: '100vh',
    overflow: 'hidden',
  },
  aside: {
    background: '#1e1e1e',
    color: '#fff',
    padding: '20px',
    overflowY: 'auto',
    scrollbarWidth: 'none', // Hide scrollbar for Firefox
    msOverflowStyle: 'none', // Hide scrollbar for Internet Explorer/Edge
    overflowX: 'hidden',
  },
  asideInner: {
    marginBottom: '20px',
  },
  activeContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '20px',
  },
 activeDot: {
    width: '13px',
    height: '13px',
    borderRadius: '50%',
    backgroundColor: '#26C281',
    marginRight: '5px',
    marginTop:'10px'
  },
  clientsList: {
    marginTop: '20px',
    maxHeight: 'calc(100% - 150px)',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  },
  copyBtn: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#000000',
    color: 'whitesmoke',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  leaveBtn: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#FF2E4C',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  editorwrap: {
    padding: '20px',
    overflow: 'hidden',
  },
};

const globalStyle = document.createElement('style');
globalStyle.innerHTML = `
  .aside::-webkit-scrollbar {
    display: none; /* Hide scrollbar for Webkit browsers */
  }
`;
document.head.appendChild(globalStyle);


export default EditorPage;
