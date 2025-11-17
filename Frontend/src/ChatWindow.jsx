// import "./ChatWindow.css";
// import Chat from "./Chat.jsx";
// import { MyContext } from "./MyContext.jsx";
// import { useContext, useState, useEffect } from "react";
// import {ScaleLoader} from "react-spinners";



// function ChatWindow() {
//   const {prompt, setPrompt, reply, setReply, currThreadId, prevChats, setPrevChats} = useContext(MyContext);
//   const [loading, setLoading] = useState(false);

//   const getReply=async()=>{
//      setLoading(true);
//     console.log("Fetching reply for prompt:", prompt, "in thread:", currThreadId);
//     const options={
//       method:"POST",
//       headers:{"Content-Type":"application/json"},
//       body:JSON.stringify({message:prompt, threadId:currThreadId})
//   };
//   try{
//     const response = await fetch("http://localhost:3000/api/chat", options);

// const res = await response.json();   // 👈 parse JSON
// console.log("Reply from server:", res);
// setReply(res.reply);         // update context so Chat.jsx can show it

//   }catch(err){
//     console.log("error is this",err);
//   }
//   setLoading(false);
// }

// //append new chats tio prevChats when reply is received
// useEffect(()=>{
//   if(prompt && reply){
//     setPrevChats(prevChats=>(
//       [...prevChats,{
//         role:"user",
//         content:prompt,
//       },{
//         role:"assistant",
//         content:reply,
//       }]
// ))
// }
// setPrompt("");
// },[reply]);

//   return (
//     <div className="chatWindow">
//       <div className="navbar">
//         <span>
//           HelperGPT <i className="fa-solid fa-chevron-down"></i>{" "}
//         </span>
//         <div className="userIconDiv">
//           <span className="userIcon">
//             <i className="fa-solid fa-user"></i>
//           </span>
//         </div>
//       </div>
//       <Chat></Chat>

//       <ScaleLoader color="#fff" loading={loading}>

//       </ScaleLoader>

//       <div className="chatInput">
//         <div className="inputBox">
//           <input type="text" placeholder="Ask Anything" value={prompt} onChange={(e)=> setPrompt(e.target.value)} onKeyDown={(e)=>e.key === 'Enter'? getReply():""}></input>
//           <div id="submit" onClick={getReply}>
//             <i className="fa-solid fa-paper-plane"></i>
//           </div>
//         </div>
//         <p className="info">
//           HelperGPT can mistakes. Check important info. See Cookie Prefrences.
//         </p>
//       </div>
//     </div>
//   );
// }
// export default ChatWindow;
import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
// We no longer need useEffect
import { useContext, useState } from "react";
import {ScaleLoader} from "react-spinners";

function ChatWindow() {
  // Remove 'reply' and 'setReply', we will use prevChats for everything
  const {prompt, setPrompt, currThreadId, prevChats, setPrevChats} = useContext(MyContext);
  const [loading, setLoading] = useState(false);

  // This is the new, corrected getReply function
  const getReply = async () => {
    // Don't send an empty message
    if (!prompt.trim()) return;

    // 1. Save the prompt to a variable so we can clear the input
    const currentPrompt = prompt;
    
    // 2. Add the user's message to the chat history immediately
    setPrevChats(currentChats => [
      ...currentChats, 
      { role: "user", content: currentPrompt }
    ]);

    // 3. Clear the input box immediately
    setPrompt(""); 
    setLoading(true);
    
    console.log("Fetching reply for prompt:", currentPrompt, "in thread:", currThreadId);
    
    const options={
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({message: currentPrompt, threadId: currThreadId}) // 4. Send the saved prompt
    };

    try {
      const response = await fetch("http://localhost:3000/api/chat", options);
      const res = await response.json(); // Parse JSON
      console.log("Reply from server:", res); // This is your console log
      
      // 5. Add the bot's reply when it arrives
      //    We use res.response as seen in your screenshot
      setPrevChats(currentChats => [
        ...currentChats,
        { role: "assistant", content: res.response } 
      ]);

    } catch(err) {
      console.log("error is this", err);
      // (Optional but good) Show an error message in the chat
      setPrevChats(currentChats => [
        ...currentChats,
        { role: "assistant", content: "Sorry, something went wrong." }
      ]);
    }
    setLoading(false);
  }

  // 6. The useEffect has been completely removed.

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

      {/* Chat will now correctly render the 'prevChats' array */}
      <Chat></Chat> 

      <ScaleLoader color="#fff" loading={loading}>
      </ScaleLoader>

      <div className="chatInput">
        <div className="inputBox">
          <input 
            type="text" 
            placeholder="Ask Anything" 
            value={prompt} 
            onChange={(e)=> setPrompt(e.target.value)} 
            // Correctly call getReply on Enter key
            onKeyDown={(e)=>e.key === 'Enter' ? getReply() : null} 
          />
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
