import React, { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { toast } from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import SlCopyButton from "@shoelace-style/shoelace/dist/react/copy-button";
import SlInput from "@shoelace-style/shoelace/dist/react/input";
import PreLoader from "../components/Preloader";
import Header from "../components/Header";
import BuyMeACoffeeButton from "../components/BuyMeACoffeeButton";

function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate some loading time (optional)
    setTimeout(() => {
      setIsLoading(false);
    }, 5000); // 1 second delay
  }, []);



  const [id, setId] = useState("");
  const [user, setUsername] = useState("");
  const navigate = useNavigate();
  const [inputStyle, setInputStyle] = useState({
    backgroundColor: "white",
    color: "black",
  });

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setId(id);
    toast.success("Created a new room");
  };
  const joinroom = async() => {
    if (!id || !user) {
      toast.error("Please enter both fields");
      return;
    }
  

    navigate(`/editor/${id}`, {
      state: {
        user,
      },
    });
  };

  const handleEnter = (e) => {
    if (e.code == "Enter") {
      joinroom();
    }
  };

  return (
    
    <div className="homepage">
{isLoading ? <PreLoader></PreLoader> : null}
<div className="header">
<div class="innerheader">
  <img src="/faicon (1).png" alt="aa" />
  <h2 className="code">Code Connect</h2>
  <BuyMeACoffeeButton></BuyMeACoffeeButton>
</div>
</div>
      <div className="formpage">
        <img className="homepageLogo" src="/faicon (1).png" alt="aa" />
        <h4 className="mainlabel">Paste Invitation Room ID</h4>
        <div className="inputGroup">
          <label>Room ID </label>
          <div>
            <input
              type="text"
              id="input1"
              onKeyUp={handleEnter}
              onMouseEnter={() => setInputStyle({ backgroundColor: "white" })}
              className="inputBox"
              placeholder="Room ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
            <SlCopyButton id="sl" from="input1.value" />
          </div>

          <label>Username</label>

          <input
            type="text"
            onKeyUp={handleEnter}
            className="inputBox"
            placeholder="Username"
            value={user}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={joinroom} className="btn joinBtn">
            Join
          </button>
          <span className="createInfo">
            Don't have an invite ? &nbsp;
            <a onClick={createNewRoom} href="" className="createnewBtn">
              Create New Room
            </a>
          </span>
        </div>
      </div>
      <footer>
        <h4>
          Built &nbsp;by&nbsp;
          <a href="https://github.com/dhaval079">dhaval079</a>
        </h4>
      </footer>
    </div>
  );
}

export default Home;
