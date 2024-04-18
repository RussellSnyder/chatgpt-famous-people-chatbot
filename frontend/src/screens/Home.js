import axios from "axios";
import React, { useEffect, useState } from "react";
import "./home.css";

const personalities = [
  {
    title: "Einstein",
    description: "German physicist",
  },
  {
    title: "Christopher Columbus",
    description: "Italian explorer",
  },
  {
    title: "Steve Jobs",
    description: "Entrepreneur who led digital revolution",
  },
  {
    title: "Thomas Edison",
    description: "Inventor and businessman",
  },
  {
    title: "Bill Gates",
    description: "Founder of Microsoft",
  },
  {
    title: "Louis Pasteur",
    description: "French chemist and Biologist",
  },
  {
    title: "Muhammed Ali",
    description: "American boxer and human rights activist",
  },
  {
    title: "Tim Berners Lee",
    description: "Inventor of World Wide Web",
  },
  {
    title: "Michael Faraday",
    description: "English scientist",
  },
  {
    title: "Mean assistant",
    description: "You'd better not chat with me",
  },
];

const Home = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [prompt, setPrompt] = useState("");
  const [jresult, setJresult] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: "You are an assistant",
    },
  ]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setInputMessage("");

    // only send a request is there is a user message
    if (inputMessage.trim() !== "") {
      try {
        // add the user message to the message array
        const updatedMessages = [
          ...messages,
          { role: "user", content: inputMessage },
        ];
        setMessages(updatedMessages);
        const response = await axios.post("api/chatbot", {
          messages: updatedMessages,
        });
        const serverResponse = response.data;

        // Add the server ersponse ot the messags array
        const updatedMessages2 = [
          ...updatedMessages,
          {
            role: "assistant",
            content: serverResponse.data.choices[0].message.content,
          },
        ];

        setMessages(updatedMessages2);
        console.log(updatedMessages2);
        setJresult(JSON.stringify(updatedMessages2, null, 2));
      } catch (error) {
        console.log(error);
        setError("Something went wrong");
      }
    }
  };

  const handleOptionSelect = (option) => {
    setMessages([
      { role: "system", content: `I want you to act as ${option}` },
    ]);
    setSelectedOption(option);
  };

  useEffect(() => {
    const chatContainer = document.getElementById("chat-container");
    const scrollOptions = {
      top: chatContainer.scrollHeight,
      behavior: "smooth",
    };
    chatContainer.scrollTo(scrollOptions);
  }, [messages.length]);
  return (
    <div>
      <div className="d-flex flex-column chat-page">
        <div id="personalities" className="container text-center">
          <h3>
            {selectedOption
              ? `You are chatting with ${selectedOption}`
              : "Please selected a character"}
          </h3>
          <div className="d-flex justify-content-center">
            {personalities.map((personality, index) => (
              <div key={index} className="text-center">
                <img
                  onClick={() => handleOptionSelect(personality.title)}
                  className={`img-fluid rounded-circle ${
                    selectedOption === personality.title ? "selected" : ""
                  }`}
                  alt={personality.title}
                  src={`images/personalities/${index + 1}.png`}
                />
                <h6>{personality.title}</h6>
                <p>{personality.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div id="chat-container" className="flex-fill overflow-auto">
          <ul className="list-group">
            {messages
              .filter(({ role }) => role !== "system")
              .map(({ role, content }, index) => (
                <li
                  key={index}
                  className={`py-4 m-2 list-group-item list-group-item-${
                    role === "user" ? "info" : "success"
                  }`}
                >
                  {content}
                </li>
              ))}
          </ul>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {prompt && <div className="alert alert-secondary mt-3">{prompt}</div>}
          {result && <div className="alert alert-success mt-3">{result}</div>}
        </div>
        <form
          className="form-horizontal mb-3 ml-1 container-fluid"
          onSubmit={handleSubmit}
        >
          <div className="row form-group mt-2">
            <div className="col-sm-11">
              <div className="form-floating">
                <input
                  className="form-control custom-input"
                  id="floatingInput"
                  placeholder="Enter a prompt"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                />
                <label htmlFor="floatingInput">input</label>
              </div>
            </div>
            <div className="col-sm-1">
              <button className="btn btn-primary custom-button" type="submit">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
      {jresult && (
        <pre className="alert alert-info mt-3">
          <code>{jresult}</code>
        </pre>
      )}
    </div>
  );
};

export default Home;
