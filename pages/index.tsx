import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;
    setMessages(prev => [...prev, { role: "user", content: input }]);
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input })
    });
    const data = await res.json();
    setMessages(prev => [...prev, { role: "assistant", content: data.messages[0].content }]);
    setInput("");
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "Arial" }}>
      <h1>Shopping Assistant</h1>
      <div style={{ border: "1px solid #ccc", padding: "1rem", height: "300px", overflowY: "auto" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.role === "user" ? "right" : "left", margin: "0.5rem 0" }}>
            <span style={{
              display: "inline-block",
              padding: "0.5rem 1rem",
              borderRadius: "1rem",
              background: m.role === "user" ? "#0070f3" : "#eaeaea",
              color: m.role === "user" ? "#fff" : "#000"
            }}>{m.content}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "1rem" }}>
        <input
          style={{ width: "80%", padding: "0.5rem" }}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask me anything..."
        />
        <button style={{ padding: "0.5rem 1rem" }} onClick={sendMessage}>Send</button>
      </div>
    </div>
);
}
