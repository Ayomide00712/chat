import { useEffect, useRef, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Chatboticon from "./component/chatboticon";
import ChatForm from "./component/ChatForm";
import ChatMessage from "./component/ChatMessage";
import { companyInfo } from "./component/company infor";
import LoginPage from "./component/chatlogin";
import { FaArrowDown, FaArrowUp} from "react-icons/fa";

const App = () => {
  const [chatHistory, setChatHistory] = useState([
    { text: companyInfo, hideInChat: true, role: "model" },
  ]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const chatBodyRef = useRef();
  
  const apiKey =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyC7ZtncSH5Ft-JIfAyECp1K-Ce-2R_Grp8";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  const generateBotResponse = async (history) => {
    const userMessage = history[history.length - 1]?.text?.toLowerCase().trim();

    const lines = companyInfo.split("\n");
    let foundQuestion = false;
    let response = "";

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().toLowerCase().startsWith(`- ${userMessage}`)) {
        foundQuestion = true;
        const nextLine = lines[i + 1]?.trim();
        if (nextLine && nextLine.startsWith("  -")) {
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

    setChatHistory((prev) => [...prev, { role: "model", text: "Thinking..." }]);

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
    chatBodyRef.current?.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  if (!isAuthenticated) {
    return <LoginPage setIsAuthenticated={setIsAuthenticated} />;
  }

  return (
    <div className="container">
      {/* <button id="chatbot-toggler" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaArrowDown /> : <FaArrowUp />}
      </button> */}
      <div className="chatbot-popup">
        <div className="chat-header flex justify-between items-center p-2 bg-gray-200">
          <div className="header-info flex items-center">
            <Chatboticon />
            <h2 className="logo-text text-xl font-bold ml-2">Chatbot</h2>
          </div>
          <button
            onClick={handleLogout}
            className=""
          >
            Log Out
          </button>
        </div>
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <Chatboticon />
            <p className="message-text">
              Hey there ✌️ <br /> how can I help you today
            </p>
          </div>
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>
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
