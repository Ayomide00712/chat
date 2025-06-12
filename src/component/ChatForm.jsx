import { useRef } from "react";

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;
    inputRef.current.value = "";
    console.log(userMessage);

    // update chat history with the user message
    setChatHistory((history) => [
      ...history,
      { role: "user", text: userMessage },
    ]);
    // Add a Thinking placeholder for the bot's response
    setTimeout(
      () =>
        setChatHistory((history) => [
          ...history,
          { role: "model", text: "Thinking..." },
        ]),
      600
    );
    generateBotResponse([
      ...chatHistory,
      {
        role: "user",
        text: `Using the details provided above, please address this query: ${userMessage}`,
      },
    ]);
  };

  return (
    <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Message..."
        className="message-input"
        required
      ></input>
      <button>
        <span class="material-symbols-outlined">keyboard_arrow_down</span>
      </button>
    </form>
  );
};

export default ChatForm;
