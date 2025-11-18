// import "./Chat.css";
// import { useContext, useState, useEffect, use } from "react";
// import { MyContext } from "./MyContext.jsx";
// import ReactMarkdown from "react-markdown";
// import rehypeHighlight from "rehype-highlight";
// import "highlight.js/styles/atom-one-dark.css";
// import "highlight.js/styles/github-dark.css";

// //react-markdown
// //rehype-highlight

// function Chat() {
//   const { newChat, prevChats, reply } = useContext(MyContext);
//   const {latestReply, setLatestReply} = useState(null);

//   useEffect(() => {
  // if(reply===null){
  //   setLatestReply(null);
  //   return;
  // }
//     //latestReply separate => typing effect create
//     if (!prevChats?.length) return;

//     const content=reply.split(""); //individual words

//     let idx=0;
//     const interval=setInterval(()=>{
//       setLatestReply(content.slice(0,idx+1).join(""));
//       idx++;
//       if(idx>=content.length){
//         clearInterval(interval);
//       }
//     },40);

//     return ()=>clearInterval(interval);

//   }, [prevChats, reply]);
//   return (
//     <>
//       {newChat && <h1>Start a new Chat! </h1>}
//       <div className="chats">
//         {
//         prevChats?.slice(0,-1).map((chat, idx) => (
//           <div
//             className={chat.role === "user" ? "userDiv" : "gptDiv"}
//             key={idx}
//           >
//             {chat.role === "user" ? 
//               <p className="userMsg">{chat.content}</p>: 
//               <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
//             }
//             {/* <p className={chat.role==="user"?"userMsg":"gptMsg"}>{chat.content}</p> */}
            
//           </div>
//         ))
//         }
//{
//prevChats?.length===0 &&
  //  <>{latestReply===null ??
  //   <div className="gptDiv" key={"non-typing"}>
//             <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{prevChats[prevChats.length-1].content}</ReactMarkdown>
//           </div>
//}</> 


//         {
//           prevChats?.length>0 && latestReply!==null &&
//           <div className="gptDiv" key={"typing"}>
//             <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
//           </div>
//         }
//         {
//           prevChats?.length>0 && latestReply===null &&
//           <div className="gptDiv" key={"non-typing"}>
//             <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{prevChats[prevChats.length-1].content}</ReactMarkdown>
//           </div>
//         }
//       </div>
//     </>
//   );
// }

// export default Chat;


import React, { useContext, useEffect, useRef, useState } from 'react';
import { MyContext } from './MyContext.jsx';
import './Chat.css'; // Make sure you have this CSS file
import ReactMarkdown from "react-markdown"; // Keep your markdown
import rehypeHighlight from "rehype-highlight"; // Keep your markdown
import "highlight.js/styles/atom-one-dark.css"; // Keep your styles
import "highlight.js/styles/github-dark.css"; // Keep your styles

function Chat() {
  const { prevChats, newChat } = useContext(MyContext);
  const chatHistoryRef = useRef(null);

  // This state will hold the "typed-out" version of the last bot message
  const [typingBotReply, setTypingBotReply] = useState('');

  // 1. This useEffect handles the typing animation
  useEffect(() => {
    if (prevChats.length === 0) return; // No chats, do nothing

    const lastMessage = prevChats[prevChats.length - 1];

    // We only animate if the very last message is from the assistant
    if (lastMessage.role === 'assistant') {
      setTypingBotReply(''); // Clear any previous animation

      const words = lastMessage.content.split(' '); // Split content by space
      let currentWordIndex = 0;
      
      // This interval runs to add one word at a time
      const interval = setInterval(() => {
        if (currentWordIndex < words.length) {
          // Add the next word plus a space
          setTypingBotReply((prev) => prev + words[currentWordIndex] + " ");
          currentWordIndex++;
        } else {
          clearInterval(interval); // Animation is finished
        }
      }, 75); // 75ms delay between words (you can adjust this)

      // CRITICAL: Cleanup function
      // This runs if prevChats changes (e.g., user sends a new message)
      // It stops the old animation, preventing conflicts.
      return () => clearInterval(interval);
    }
  }, [prevChats]); // This effect re-runs only when the prevChats array changes

  // 2. This useEffect handles auto-scrolling
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
    // We scroll when the chat array changes OR when a new word is typed
  }, [prevChats, typingBotReply]);

  return (
    <div className="chats" ref={chatHistoryRef}>
      
      {newChat && prevChats.length === 0 ? (
        <h1 className="start-new-chat">Start a new Chat!</h1>
      ) : (
        // 3. We map over the ENTIRE chat history
        prevChats.map((chat, index) => (
          <div 
            key={index} 
            className={chat.role === 'user' ? 'userDiv' : 'gptDiv'}
          >
            {/* 4. LOGIC: Is this a user message? */}
            {chat.role === "user" ? 
              (
                // Yes: Just render the content
                <p className="userMsg">{chat.content}</p> 
              ) : (
                // No: It's a bot message.
                // 5. LOGIC: Is this the last message in the array?
                index === prevChats.length - 1 ? 
                (
                  // Yes: Render the animated 'typingBotReply'
                  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                    {typingBotReply}
                  </ReactMarkdown>
                ) : (
                  // No: It's an older bot message, render it instantly
                  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                    {chat.content}
                  </ReactMarkdown>
                )
              )
            }
          </div>
        ))
      )}
    </div>
  );
}

export default Chat;