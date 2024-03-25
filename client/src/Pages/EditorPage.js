import React, { useEffect, useRef } from "react";
import Client from "../components/Client";
import { useState } from "react";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import ACTIONS from "../Actions";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import toast from "react-hot-toast";

const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { id } = useParams();
  const reactNavigator = useNavigate();
  const [clients, setClients] = useState([{}]);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        socketRef.current = await initSocket();
        socketRef.current.on('connect', () => setSocketConnected(true));


      socketRef.current = await initSocket();
   
      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed try again later");
        reactNavigator("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        id,
        user: location.state?.user,
      });

      socketRef.current.on(ACTIONS.JOINED, ({ clients, user, socketId }) => {
        if (user !== location.state?.user) {
          toast.success(`${user} joined the room`);
          console.log(`${user} joined the room`);
        }
        setClients(clients);
        socketRef.current.emit(ACTIONS.SYNC_CODE,{
          code : codeRef.current,
          socketId,
        })
      });
      
      socketRef.current.on("connection_error", (err) => {
        handleErrors(err);
      });
      socketRef.current.on("connection_failed", (err) => {
        handleErrors(err);
      });

      socketRef.current.on(
        ACTIONS.DISCONNECTED,
        ({ socketId, user }) => {
            toast.success(`${user} left the room.`);
            setClients((prev) => {
                return prev.filter(
                    (client) => client.socketId !== socketId
                );
            });
        }
    );
      } catch (err) {
        
      }
    };
    init();
    return () => {
      if (socketRef.current && socketConnected) {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      }
    }
  }, []);

  async function copyRoomId () {
    try{
      await navigator.clipboard.writeText(id);
      toast.success("Copied Room ID")
    }
    catch(e){
      toast.error("Failed to copy Room ID")
      console.log(e);
    }
  }

  if (!location.state) {
    return <Navigate to="/" />;
  }

  function leaveRoom(){
    if (window.confirm("Are you sure you want to leave?")) {

    socketRef.current.emit(ACTIONS.LEAVE_ROOM, { id }); // Assuming you have an ACTIONS.LEAVE_ROOM event

    // Disconnect the socket
    socketRef.current.disconnect();
  
    reactNavigator("/");
    }
  }

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img className="logoImage" src="/code.png" alt="codesync" />
          </div>
          <div class="container">
            <div class="dot"></div>
            <div class="text"> Active</div>
          </div>

          <div className="clientsList">
            {clients.map((client) => (
              <Client key={client.socketId} user={client.user} />
            ))}
          </div>

        </div>
        <button className="btn copyBtn" onClick={copyRoomId}>Copy Room ID</button>
        <button className="btn leaveBtn" onClick={leaveRoom}>Leave</button>
      </div>
      <div className="editorwrap">
        <Editor socketRef={socketRef} id={id} onCodeChange={(code)=>{codeRef.current = code;}}/>
      </div>
    </div>
  );
};

export default EditorPage;
