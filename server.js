// import { GoogleGenAI } from "@google/genai";
// import 'dotenv/config';

// // The client gets the API key from the environment variable `GEMINI_API_KEY`.
// const ai = new GoogleGenAI({'GEMINI_API_KEY': process.env.GEMINI_API_KEY});

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: "Explain how AI works in a few words",
//     input:'Joke related to computer secience'
//   });
//   console.log(response.text);
// }

// main();

import express from 'express';
import 'dotenv/config'; // Make sure to install: npm install dotenv
import mongoose from 'mongoose';
import cors from 'cors';
import chatRoutes from './Backend/routes/chat.js';
// We use 'node-fetch' for compatibility, but in Node.js 18+
// 'fetch' is available globally.
import fetch from 'node-fetch'; 

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies (like req.body)
app.use(express.json());
app.use(cors());

app.use("/api", chatRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  connectToDatabase();
});

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

  } catch (error) {
    console.error("Failed to connect with MongoDB:", error);
  }
}

// This is the route, just like in your image
// app.post("/test", async (req, res) => {
  
//   // 1. Get the prompt from the request body
//   // We assume the client sends: { "prompt": "Explain AI..." }
//   const { message: prompt } = req.body;

//   if (!prompt) {
//     return res.status(400).send({ error: "Prompt is required" });
//   }

//   // --- This section is changed for Google AI Studio ---

//   const apiKey = process.env.GEMINI_API_KEY; // Your Google AI Studio key
//   const model = "gemini-2.5-flash"; // Or "gemini-1.5-pro", etc.

//   // 2. The Google AI Studio (Gemini) API endpoint
//   const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

//   // 3. The request payload (body) formatted for Gemini
//   // This is different from OpenAI's 'messages' array
//   const payload = {
//     contents: [
//       {
//         role: "user",
//         parts: [
//           {
//             text: prompt 
//           }
//         ]
//       }
//     ]
//   };

//   // 4. The 'options' for the fetch call
//   const options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       // Note: No 'Authorization: Bearer' header.
//       // Authentication is done via the 'key' in the URL.
//     },
//     body: JSON.stringify(payload),
//   };

//   // ---------------------------------------------------

//   try {
//     const geminiResponse = await fetch(url, options);
    
//     if (!geminiResponse.ok) {
//       // Log the detailed error from the API
//       const errorData = await geminiResponse.json();
//       console.error("Gemini API Error:", errorData.error);
//       throw new Error(`API call failed with status: ${geminiResponse.status}`);
//     }

//     const data = await geminiResponse.json();
    
//     // In your original code, you sent the full 'data' object.
//     // We can do that here too.
//     // res.send(data);

//     // Or, to send back just the text (which is usually more useful):
//     const textResponse = data.candidates[0].content.parts[0].text;
//     res.send({ response: textResponse });
//     console.log("Gemini Response Text:", data.candidates[0].content.parts[0].text);

//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ error: "Internal server error" });
//   }
// });