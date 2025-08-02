import Chatboticon from "./chatboticon";

const urlRegex = /(https?:\/\/[^\s<>"']+)/g;

const parseLinks = (text) => {
  // Split the text by URLs and ensure proper link detection
  const parts = text.split(urlRegex);
  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      // Normalize the URL to ensure it starts with http:// or https://
      const normalizedUrl = part.startsWith("http") ? part : `https://${part}`;
      return (
        <a
          key={index}
          href={normalizedUrl}
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
    // Replace newlines with <br /> for proper formatting
    return part.split("\n").map((line, i, arr) => (
      <span key={`${index}-${i}`}>
        {line}
        {i < arr.length - 1 && <br />}
      </span>
    ));
  });
};

const ChatMessage = ({ chat }) => {
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
};

export default ChatMessage;
