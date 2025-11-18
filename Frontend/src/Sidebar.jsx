import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";
import { set } from "mongoose";

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/threads");
      const res = await response.json();
      const filteredData =
        res.threads.map((thread) => ({
          threadId: thread.threadId,
          title: thread.title,
        })) || [];
      console.log(filteredData);
      // setAllThreads(filteredData);
      //store threadId and title
      setAllThreads(filteredData);
    } catch (err) {
      console.log("error in fetching threads", err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (newthreadId) => {
    setCurrThreadId(newthreadId);
    try {
      const response = fetch(
        `http://localhost:3000/api/threads/${newthreadId}`
      );
      const res = await response.json();
      console.log("previous chats", res);
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log("error in changing thread", err);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/threads/${threadId}`,
        {
          method: "DELETE",
        }
      );
      const res = await response.json();
      console.log("deleted thread", res);

      //updated thread re-render
      setAllThreads((prevThreads) =>
        prevThreads.filter((thread) => thread.threadId !== threadId)
      );
      if (currThreadId === threadId) {
        // If the deleted thread is the current one, reset to a new chat
        createNewChat();
      }
    } catch (err) {
      console.log("error in deleting thread", err);
    }
  };

  return (
    <section className="sidebar">
      {/* new Chat button */}
      <button onClick={createNewChat}>
        <img src="backlogo.png" alt="GPTlogo" className="logo"></img>
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      {/*history */}
      <ul className="history">
        {allThreads?.map((thread, idx) => (
          <li key={idx} onClick={() => changeThread(thread.threadId)} className={  thread.threadId=== currThreadId? "highlighted": ""}>
            {thread.title}
            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation();
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>

      {/*sign */}
      <div className="sign">
        <p>Made by &hearts; </p>
      </div>
    </section>
  );
}
export default Sidebar;
