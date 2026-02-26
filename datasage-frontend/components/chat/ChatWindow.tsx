"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Code, AlertCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  sql?: string | null;
  error?: boolean;
}

interface ChatWindowProps {
  chatId: string;
  userId: string;
}

export function ChatWindow({ chatId, userId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load local history for this chat
  useEffect(() => {
    const historyKey = `datasage_history_${chatId}`;
    const saved = localStorage.getItem(historyKey);
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([
        {
          id: "welcome",
          role: "bot",
          content:
            "Hello! I'm DataSage. Ask me any question about your database.",
        },
      ]);
    }
  }, [chatId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Save history
  const appendMessage = (msg: Message) => {
    setMessages((prev) => {
      const updated = [...prev, msg];
      // Keep only last 10 local messages to avoid quota limits
      const limited = updated.slice(-10);
      localStorage.setItem(
        `datasage_history_${chatId}`,
        JSON.stringify(limited),
      );
      return updated;
    });
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: " " + input.trim(), // adding space for logic formatting later if needed
    };

    appendMessage(userMsg);
    const query = input.trim();
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/user_request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          chat_id: chatId,
          user_req: query,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to get response");
      }

      const data = await res.json();
      appendMessage({
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: data.response || "No response provided.",
        sql:
          data.sql_query && data.sql_query !== "INVALID_QUERY"
            ? data.sql_query
            : null,
      });
    } catch (err) {
      appendMessage({
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: "Sorry, I encountered an error communicating with the server.",
        error: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full h-[calc(100vh-2rem)] rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl shadow-glass overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
            <Bot className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="font-semibold text-white/90">DataSage Assistant</h2>
            <p className="text-xs text-white/50">Chat ID: {chatId}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((msg) => (
          <RevealOnScroll key={msg.id} delay={0}>
            <div
              className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                  msg.role === "user"
                    ? "bg-white/10 border-white/20"
                    : "bg-indigo-500/20 border-indigo-500/30"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="w-4 h-4 text-white/70" />
                ) : (
                  <Bot className="w-4 h-4 text-indigo-400" />
                )}
              </div>
              <div
                className={`flex flex-col gap-2 max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`px-5 py-3 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-white/10 text-white/90 rounded-tr-sm"
                      : msg.error
                        ? "bg-red-500/10 text-red-200 border border-red-500/20 rounded-tl-sm"
                        : "bg-black/40 text-white/80 border border-white/10 shadow-glass rounded-tl-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {msg.content.trim()}
                  </p>
                </div>

                {msg.sql && (
                  <GlassCard variant="colored" className="w-full mt-1">
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10 bg-black/20">
                      <Code className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
                        Generated SQL
                      </span>
                    </div>
                    <div className="p-4 bg-black/40 overflow-x-auto custom-scrollbar">
                      <pre className="text-sm font-mono text-emerald-300/90 whitespace-pre">
                        {msg.sql}
                      </pre>
                    </div>
                  </GlassCard>
                )}
              </div>
            </div>
          </RevealOnScroll>
        ))}
        {loading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/30">
              <Bot className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="px-5 py-3 rounded-2xl bg-black/40 text-white/50 border border-white/10 shadow-glass rounded-tl-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse delay-150" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse delay-300" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-white/5">
        <form
          onSubmit={handleSend}
          className="relative flex items-center w-full max-w-4xl mx-auto"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            disabled={loading}
            className="w-full py-4 pl-5 pr-14 bg-black/40 border border-white/10 rounded-2xl outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-white placeholder:text-white/30 shadow-inset"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 p-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5 min-w-[20px] min-h-[20px]" />
          </button>
        </form>
      </div>
    </div>
  );
}
