// import "dotenv/config";
// import express from "express";

// const getAiStudioResponse = async (prompt) =>{
//     const options = {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           // Note: No 'Authorization: Bearer' header.
//           // Authentication is done via the 'key' in the URL.
//         },
//         body: JSON.stringify(payload),
//       };
    
//       // ---------------------------------------------------
    
//       try {
//         const geminiResponse = await fetch(url, options);
        
//         if (!geminiResponse.ok) {
//           // Log the detailed error from the API
//           const errorData = await geminiResponse.json();
//           console.error("Gemini API Error:", errorData.error);
//           throw new Error(`API call failed with status: ${geminiResponse.status}`);
//         }
    
//         const data = await geminiResponse.json();
        
//         // In your original code, you sent the full 'data' object.
//         // We can do that here too.
//         // res.send(data);
    
//         // Or, to send back just the text (which is usually more useful):
//         const textResponse = data.candidates[0].content.parts[0].text;
//         res.send({ response: textResponse });
//         console.log("Gemini Response Text:", data.candidates[0].content.parts[0].text); //reply
    
//       } catch (err) {
//         console.error(err);
//         res.status(500).send({ error: "Internal server error" });
//       }
// }

// export default getAiStudioResponse;


// In: Backend/utils/aiStudio.js

import 'dotenv/config';
import fetch from 'node-fetch'; // 1. You MUST import fetch to use it

// 2. 'import express' is not needed here

const getAiStudioResponse = async (prompt) => {
  // 3. Define your URL and API Key
  const apiKey = process.env.GEMINI_API_KEY;
  const model = "gemini-1.5-flash"; // Or your preferred model
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  // 4. DEFINE THE PAYLOAD (This fixes your 'payload is not defined' error)
  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  };

  // 5. Your options object (this was mostly correct)
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload), // Now 'payload' is defined
  };

  // 6. Your try/catch block (this is now fixed)
  try {
    const geminiResponse = await fetch(url, options); // Now 'url' and 'fetch' are defined

    if (!geminiResponse.ok) {
      // This will safely get the error, even if it's HTML, not JSON
      const errorText = await geminiResponse.text();
      console.error("Gemini API Error (Raw Text):", errorText);
      throw new Error(`API call failed with status ${geminiResponse.status}. Check API key.`);
    }

    const data = await geminiResponse.json();
    const textResponse = data.candidates[0].content.parts[0].text;

    // 7. RETURN the text (don't use res.send)
    // The chat.js file will handle sending the response
    return textResponse;
    
  } catch (err) {
    console.error(err);
    // 8. THROW the error (don't use res.status)
    // The chat.js file will catch this and send the 500 error
    throw new Error("Failed to get response from AI");
  }
};

export default getAiStudioResponse;