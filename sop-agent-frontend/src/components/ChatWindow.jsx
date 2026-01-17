import { useState, useEffect } from "react";
import { askQuestion } from "../services/api";
import MessageBubble from "./MessageBubble";
import SourcesPanel from "./SourcesPanel";

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sources, setSources] = useState([]);

  // 🔹 Load chat history
  useEffect(() => {
    const saved = localStorage.getItem("chatHistory");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // 🔹 Save chat history
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  async function send() {
    if (!input.trim()) return;

    const question = input;
    setMessages(m => [...m, { text: question, sender: "user" }]);
    setInput("");

    const start = performance.now();

    try {
      const data = await askQuestion(question, messages.map(m => ({
        role: m.sender === "user" ? "user" : "assistant",
        text: m.text
      })));

      console.log("BACKEND RESPONSE:", data);

      const end = performance.now();
      console.log("RAG latency:", (end - start).toFixed(0), "ms");

      //  Hallucination guard
      if (!data.answer || data.answer.length < 20) {
        setMessages(m => [...m, { text: "I don't know.", sender: "bot" }]);
        return;
      }

      setMessages(m => [...m, { text: data.answer, sender: "bot" }]);
      setSources(data.sources || []);

    } catch (err) {
      console.error(err);
      setMessages(m => [...m, { text: "Server error. Check console.", sender: "bot" }]);
    }
  }

  return (
    <div className="chat">
      <div className="messages">
        {messages.map((m, i) => (
          <MessageBubble key={i} {...m} />
        ))}
      </div>

      <SourcesPanel sources={sources} />

      <div className="input-box">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about SOP..."
          onKeyDown={e => e.key === "Enter" && send()}
        />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}
