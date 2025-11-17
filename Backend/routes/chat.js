import express from 'express';
import Thread from '../models/Thread.js';
import getAiStudioResponse from '../utils/aiStudio.js';

const router = express.Router();

// Example chat route
router.post('/test', async (req, res) => {
  try{
    const thread= new Thread({
        threadId: "hi8070",
        title:"Testing new thread22"
    });
    const response= await thread.save();
    res.send(response);

  }catch(error){
    console.log(error);
    res.status(500).json({ error: "Failed to save in DB" });
  }
});

//Get all threads
router.get('/thread', async (req, res) => {
  try {
    const threads = await Thread.find().sort({ updatedAt: -1 });//descending order of updatedAt... most recent first
    res.json(threads);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

router.get('/thread/:threadId', async (req, res) => {
    const { threadId } = req.params;
    try{
        const thread = await Thread.findOne({ threadId });
        if(!thread){
            return res.status(404).json({ error: "Thread not found" });
        }
        res.json(thread.messages);//printing response answer only
     } catch (error) {
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});


router.delete('/thread/:threadId', async (req, res) => {
    const { threadId } = req.params;
    try{
        const deletedThread = await Thread.findOneAndDelete({ threadId });
        if(!deletedThread){
            return res.status(404).json({ error: "Thread not found" });
        }
        res.status(200).json({ message: "Thread deleted successfully" });
    } catch (error) {
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

router.post("/chat", async (req, res) => {
    const {threadId, message} = req.body;

    if(!threadId || !message){
        return res.status(400).json({ error: "threadId and message are required" });
    }
    try{
        let thread = await Thread.findOne({ threadId });
        if(!thread){
            //create new thread in DB
            thread = new Thread({
                threadId,
                title: message,
                messages: [{ role: 'user', content: message }]
            });
        } else {
            //append message to existing thread
            thread.messages.push({ role: 'user', content: message});
        }

       const assistantReply= await getAiStudioResponse(message);

       thread.messages.push({ role: 'assistant', content: assistantReply});
       thread.updatedAt = Date.now();

       await thread.save();
       res.json({ response: assistantReply });
    }catch(error){
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;