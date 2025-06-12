import Chatboticon from "./chatboticon";

const urlRegex = /(https?:\/\/[^\s<>"']+)/g;

const parseLinks = (text) => {
  const parts = text.split(urlRegex);
  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="chat-link"
          style={{ color: "#007bff", textDecoration: "underline" }}
          aria-label={`Visit ${part}`}
        >
          {part}
        </a>
      );
    }
    return part;
  });
};


const ChatMessage = ({chat}) => {
  return (
    !chat.hideInChat && (
      <div
        className={`message ${chat.role === "model" ? "bot" : "user"}-message`}
      >
        {chat.role === "model" && <Chatboticon />}
        <p className="message-text">{parseLinks(chat.text)}</p>
      </div>
    )
  );
}

export default ChatMessage
