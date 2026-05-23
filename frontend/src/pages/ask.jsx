import { useState, useRef, useEffect } from "react";

const SUGGESTED_QUESTIONS = [
  "When is the next match?",
  "Who's our manager?",
  "Tell me about Bukayo Saka",
  "How are we doing in the league?",
];

export default function Ask() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const askQuestion = async (question) => {
    if (!question.trim() || loading) return;

    setMessages(prev => [...prev, { role: "user", content: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/qa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();

      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.answer,
        sources: data.sources,
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, I couldn't answer that. Try asking something else."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    askQuestion(input);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 min-h-[calc(100vh-180px)] flex flex-col">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 bg-[#EF0107] rounded-full animate-pulse"></span>
          <h1 className="text-3xl font-bold">Ask the Hub</h1>
        </div>
        <p className="text-white/50 text-sm">
          Ask anything about Arsenal — fixtures, squad, results, news. Powered by AI.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto mb-6 space-y-4">
        {messages.length === 0 ? (
          <div className="space-y-3">
            <p className="text-xs text-white/40 uppercase tracking-[0.2em] mb-4">Try asking</p>
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => askQuestion(q)}
                className="block w-full text-sm text-white/70 hover:text-white text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-4 py-3 rounded-xl transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        ) : (
          messages.map((msg, i) => <Message key={i} message={msg} />)
        )}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 sticky bottom-0 bg-[#1f1e1d] py-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about Arsenal..."
          className="flex-1 bg-white/5 border border-white/10 focus:border-white/30 rounded-xl px-4 py-3 text-sm outline-none transition-colors placeholder:text-white/30"
          disabled={loading}
          maxLength={500}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-[#EF0107] hover:bg-[#EF0107]/90 disabled:bg-white/10 disabled:text-white/40 px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
        >
          Ask
        </button>
      </form>
    </div>
  );
}

function Message({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] px-4 py-3 rounded-2xl ${
        isUser
          ? "bg-[#EF0107] text-white rounded-br-sm"
          : "bg-white/5 border border-white/10 rounded-bl-sm"
      }`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        {message.sources && message.sources.length > 0 && (
          <div className="mt-2 pt-2 border-t border-white/10 flex flex-wrap gap-1">
            {message.sources.map(src => (
              <span key={src} className="text-[10px] uppercase tracking-wider text-white/40 px-1.5 py-0.5 bg-white/5 rounded">
                {src}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}