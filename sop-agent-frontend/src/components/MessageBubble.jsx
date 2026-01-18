export default function MessageBubble({ text, sender }) {
  return (
    <div className={sender === "user" ? "user-msg" : "bot-msg"}>
      {text}
    </div>
  );
}
