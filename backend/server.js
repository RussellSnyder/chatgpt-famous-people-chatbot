//import modules: express, dotenv
const express = require("express");
const dotenv = require("dotenv");
var cors = require("cors");
const app = express();
const OpenAI = require("openai");
const axios = require("axios");

app.use(cors());
//accept json data in requests
app.use(express.json());

//setup environment variables
dotenv.config();

//build openai instance using OpenAIApi
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

//build the runCompletion which sends a request to the OPENAI Completion API
async function runCompletion(messages) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
    temperature: 1,
    max_tokens: 50,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  return response;
}

//post request to /api/chatgpt
app.post("/api/chatbot", async (req, res) => {
  try {
    //extract the messages from the request body
    const { messages } = req.body;

    // request 1
    // Pass the request text to the runCompletion function
    const completion = await runCompletion(messages);

    res.status(200).json({ data: completion });
  } catch (error) {
    //handle the error in the catch statement
    console.error("error:", error);
    res.status(500).json({
      error: {
        message: "An error occured during your request.",
      },
    });
  }
});

//set the PORT
const PORT = process.env.SERVER_PORT || 5001;

//start the server on the chosen PORT
app.listen(PORT, console.log(`Server started on port ${PORT}`));
