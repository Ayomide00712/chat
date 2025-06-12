import { useEffect, useRef, useState } from "react";
import Chatboticon from "./component/chatboticon";
import ChatForm from "./component/ChatForm";
import ChatMessage from "./component/ChatMessage";
import { companyInfo } from "./component/company infor";

const App = () => {
  const [chatHistory, setChatHistory] = useState([{text: companyInfo, hideInChat: true, role:"model"}]);
const chatBodyRef = useRef()

  const apiKey =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyC7ZtncSH5Ft-JIfAyECp1K-Ce-2R_Grp8";

    const generateBotResponse = async (history) => {
      const userMessage = history[history.length - 1]?.text
        ?.toLowerCase()
        .trim();

      // Search for the question in the companyInfo string
      const lines = companyInfo.split("\n");
      let foundQuestion = false;
      let response = "";

      for (let i = 0; i < lines.length; i++) {
        // Check if the line is a question (starts with "- " and matches user input)
        if (lines[i].trim().toLowerCase().startsWith(`- ${userMessage}`)) {
          foundQuestion = true;
          // Extract the first sentence of the answer (next line)
          const nextLine = lines[i + 1]?.trim();
          if (nextLine && nextLine.startsWith("  -")) {
            // Get the first sentence by splitting on period
            response = nextLine.replace("  - ", "").split(".")[0] + ".";
          }
          break;
        }
      }

      if (foundQuestion && response) {
        setChatHistory((prev) => [
          ...prev,
          { role: "model", text: response.trim() },
        ]);
        return;
      }

      // Fallback to Gemini API with a prompt for concise answers
      setChatHistory((prev) => [
        ...prev,
        { role: "model", text: "Thinking..." },
      ]);

      const formattedHistory = history
        .filter(
          (msg) =>
            typeof msg.text === "string" &&
            (msg.role === "user" || msg.role === "model")
        )
        .map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.text }],
        }));

      // Add a system prompt to ensure concise responses
      const systemPrompt = {
        role: "model",
        parts: [{ text: "Provide a concise answer in one or two sentences." }],
      };

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [systemPrompt, ...formattedHistory],
        }),
      };

      try {
        const response = await fetch(apiKey, requestOptions);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error?.message || "Something went wrong");
        }

        const reply =
          data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
          "Sorry, I couldn't get that. Try again.";

        setChatHistory((prev) => [
          ...prev.filter((msg) => msg.text !== "Thinking..."),
          { role: "model", text: reply },
        ]);
      } catch (error) {
        console.error("API error:", error.message);
        setChatHistory((prev) => [
          ...prev.filter((msg) => msg.text !== "Thinking..."),
          { role: "model", text: "Error: Unable to respond." },
        ]);
      }
    };

  useEffect(() => {
    // Auto scroll whenever chat history updates
chatBodyRef.current.scrollTo({top: chatBodyRef.current.scrollHeight, behavior: "smooth"})
  }, [chatHistory])

  return (
    <div className="container">
      <button id="chatbot-toggler">
        
        <span className="material-symbols-outlined">keyboard_arrow_down</span>
        <span className="material-symbols-outlined">keyboard_arrow_down</span>
      </button>
      <div className="chatbot-popup">
        {/* chatbot header */}
        <div className="chat-header">
          <div className="header-info">
            <Chatboticon />
            <h2 className="logo-text">Chatbot</h2>
          </div>
          <button>
            <span className="material-symbols-outlined">
              keyboard_arrow_down
            </span>
          </button>
        </div>

        {/* chatbot body */}

        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <Chatboticon />
            <p className="message-text">
              Hey there ✌️ <br /> how can I help you today
            </p>
          </div>

          {/* Render the chat history dynamically */}
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        {/* chatbot footer */}
        <div className="chat-footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
