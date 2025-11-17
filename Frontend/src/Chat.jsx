import "./Chat.css";
import { useContext, useState, useEffect, use } from "react";
import { MyContext } from "./MyContext.jsx";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";
import "highlight.js/styles/github-dark.css";

//react-markdown
//rehype-highlight

function Chat() {
  const { newChat, prevChats, reply } = useContext(MyContext);
  const {latestReply, setLatestReply} = useState(null);

  useEffect(() => {
    //latestReply separate => typing effect create
    if (!prevChats?.length) return;

    const content=reply.split(""); //individual words

    let idx=0;
    const interval=setInterval(()=>{
      setLatestReply(content.slice(0,idx+1).join(""));
      idx++;
      if(idx>=content.length){
        clearInterval(interval);
      }
    },40);

    return ()=>clearInterval(interval);

  }, [prevChats, reply]);
  return (
    <>
      {newChat && <h1>Start a new Chat! </h1>}
      <div className="chats">
        {
        prevChats?.slice(0,-1).map((chat, idx) => (
          <div
            className={chat.role === "user" ? "userDiv" : "gptDiv"}
            key={idx}
          >
            {chat.role === "user" ? 
              <p className="userMsg">{chat.content}</p>: 
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
            }
            {/* <p className={chat.role==="user"?"userMsg":"gptMsg"}>{chat.content}</p> */}
            
          </div>
        ))
        }

        {
          prevChats?.length>0 && latestReply!==null &&
          <div className="gptDiv" key={"typing"}>
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
          </div>
        }
      </div>
    </>
  );
}

export default Chat;
