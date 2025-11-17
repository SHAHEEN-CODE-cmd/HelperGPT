import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import {ScaleLoader} from "react-spinners";



function ChatWindow() {
  const {prompt, setPrompt, reply, setReply, currThreadId, prevChats, setPrevChats} = useContext(MyContext);
  const [loading, setLoading] = useState(false);

  const getReply=async()=>{
     setLoading(true);
    console.log("Fetching reply for prompt:", prompt, "in thread:", currThreadId);
    const options={
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({message:prompt, threadId:currThreadId})
  };
  try{
    const response = await fetch("http://localhost:3000/api/chat", options);

const res = await response.json();   // 👈 parse JSON
console.log("Reply from server:", res);
setReply(res.reply);         // update context so Chat.jsx can show it

  }catch(err){
    console.log("error is this",err);
  }
  setLoading(false);
}

//append new chats tio prevChats when reply is received
useEffect(()=>{
  if(prompt && reply){
    setPrevChats(prevChats=>(
      [...prevChats,{
        role:"user",
        content:prompt,
      },{
        role:"assistant",
        content:reply,
      }]
))
}
setPrompt("");
},[reply]);

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>
          HelperGPT <i className="fa-solid fa-chevron-down"></i>{" "}
        </span>
        <div className="userIconDiv">
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>
      <Chat></Chat>

      <ScaleLoader color="#fff" loading={loading}>

      </ScaleLoader>

      <div className="chatInput">
        <div className="inputBox">
          <input type="text" placeholder="Ask Anything" value={prompt} onChange={(e)=> setPrompt(e.target.value)} onKeyDown={(e)=>e.key === 'Enter'? getReply():""}></input>
          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">
          HelperGPT can mistakes. Check important info. See Cookie Prefrences.
        </p>
      </div>
    </div>
  );
}
export default ChatWindow;
