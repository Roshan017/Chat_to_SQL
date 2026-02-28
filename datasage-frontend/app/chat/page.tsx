"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAppContext, Message } from "../context/AppContext";

export default function ChatPage() {
  const { state, updateState, resetState } = useAppContext();

  // Create a stable session ID if none exists in context just for display
  const sessionId = state.chatId || "NEW-SESSION";

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages, isLoading]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    // Add user message to UI
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: "user",
      text: trimmedInput,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    updateState({ messages: [...state.messages, userMsg] });
    setInput("");
    setIsLoading(true);

    try {
      const payload = {
        user_id: state.userId || "anonymous",
        chat_id: state.chatId || "anonymous-chat",
        user_req: trimmedInput,
      };

      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${API_URL}/user_request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`DataSage API error: ${res.status}`);
      }

      const data = await res.json();

      // Parse backend response - per user instructions: "only the query if available and response should be in ui"
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        text: data.response || "I have processed your request.",
        sqlQuery: data.sql_query,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      updateState({ messages: [...state.messages, userMsg, botMsg] });
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : String(err);

      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: "system",
        text: `Error parsing request: ${errorMessage}`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      updateState({ messages: [...state.messages, userMsg, errorMsg] });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-darker text-slate-900 dark:text-slate-100 h-screen overflow-hidden flex font-display">
      {/* Sidebar */}
      <aside className="w-64 bg-obsidian-dark dark:bg-obsidian-dark border-r border-obsidian-border flex flex-col h-full shrink-0 z-20 transition-all duration-300">
        {/* Brand */}
        <div className="p-6 flex items-center gap-3">
          <div className="bg-gradient-to-br from-primary to-accent-cyan rounded-lg p-2 shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-white text-xl">
              dataset
            </span>
          </div>
          <div>
            <Link href="/">
              <h1 className="text-white text-lg font-bold tracking-tight">
                DataSage
              </h1>
            </Link>
            <p className="text-slate-500 text-xs font-mono">v2.4.0-flux</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 pt-2 pb-1 text-xs font-mono text-slate-500 uppercase tracking-wider">
            Workspace
          </div>
          <Link
            href="/chat"
            className="group flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary border border-primary/20 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">
              chat_bubble
            </span>
            <span className="text-sm font-medium">Orchestrator</span>
            <span className="ml-auto w-2 h-2 rounded-full bg-accent-cyan shadow-[0_0_8px_rgba(0,229,255,0.6)]"></span>
          </Link>
          <Link
            href="/schema"
            className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-obsidian-border/50 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">schema</span>
            <span className="text-sm font-medium">Schema</span>
          </Link>

          <div className="mt-6 px-3 pt-2 pb-1 text-xs font-mono text-slate-500 uppercase tracking-wider">
            Sessions
          </div>
          {/* Empty state for sessions */}
          <div className="px-3 py-2 text-xs text-slate-600 italic">
            No recent sessions found.
          </div>
        </nav>

        {/* User/Settings & Disconnect */}
        <div className="p-4 border-t border-obsidian-border space-y-2">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-obsidian-border/50 cursor-pointer transition-colors">
            <div
              className="h-8 w-8 rounded-full bg-cover bg-center ring-2 ring-primary/30"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAcM63_Atkegtg-In9ktjUpQEoRYApjN_vuwveuJMMLJQkjeng3pE1llwGfczeM1cxgQ9P25I9agkVw8hFSDIICZBx8Ql9qIlriUdvZMJcGudQ2znKMl7rKenpVxijfy-Fm37NRJ7DBNlPJWuPGCHlFDGbK-VIqr3RG4Uqe6rP7wudGaV7eWslNxv0SGaD1uyUGNqdqzi2K9mMJ3hrDXEOUqOw-hjRN4t2nnl17CV3asbEpUQx1-cX_apwvCxoS-2UDp7W3pwVXrux2')",
              }}
            ></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                DevAdmin
              </p>
              <p className="text-xs text-slate-500 truncate">
                admin@datasage.io
              </p>
            </div>
            <span className="material-symbols-outlined text-slate-500">
              settings
            </span>
          </div>

          <button
            onClick={async () => {
              if (
                window.confirm(
                  "Are you sure you want to disconnect from this database?",
                )
              ) {
                try {
                  const API_URL =
                    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
                  await fetch(`${API_URL}/disconnect`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user_id: state.userId }),
                  });
                } catch (err) {
                  console.error("Failed to call backend disconnect API", err);
                }
                // Clear app context and return to home page
                localStorage.removeItem("datasage_app_state");
                resetState();
                window.location.href = "/";
              }
            }}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-red-400 hover:text-white hover:bg-red-500/20 transition-colors mt-2"
          >
            <span className="material-symbols-outlined text-sm">
              power_settings_new
            </span>
            <span className="text-xs font-bold uppercase tracking-wider">
              Disconnect DB
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative min-w-0 bg-background-darker">
        {/* Header */}
        <header className="shrink-0 h-16 border-b border-obsidian-border flex items-center justify-between px-6 bg-background-darker/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Active Session:
              <span className="text-primary font-mono whitespace-nowrap bg-primary/10 px-2 py-0.5 rounded border border-primary/20 text-xs">
                {sessionId.split("-")[0]}...
              </span>
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
              CONNECTED
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 hidden sm:flex">
              <span className="text-xs text-slate-400 font-mono text-[10px]">
                DB: {state.dbId || "NOT CONNECTED"}
              </span>
            </div>
            <div className="h-4 w-px bg-obsidian-border hidden sm:block"></div>
            <button className="text-slate-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="text-slate-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined">help</span>
            </button>
          </div>
        </header>

        {/* Chat Stream */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 scroll-smooth"
          id="chat-container"
        >
          {state.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-4 max-w-4xl mx-auto ${msg.role === "system" ? "opacity-70" : ""}`}
            >
              {/* Avatar Column */}
              <div className="flex-shrink-0 mt-1">
                {msg.role === "user" ? (
                  <div
                    className="w-8 h-8 rounded-full bg-cover bg-center ring-1 ring-border-glass"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAcM63_Atkegtg-In9ktjUpQEoRYApjN_vuwveuJMMLJQkjeng3pE1llwGfczeM1cxgQ9P25I9agkVw8hFSDIICZBx8Ql9qIlriUdvZMJcGudQ2znKMl7rKenpVxijfy-Fm37NRJ7DBNlPJWuPGCHlFDGbK-VIqr3RG4Uqe6rP7wudGaV7eWslNxv0SGaD1uyUGNqdqzi2K9mMJ3hrDXEOUqOw-hjRN4t2nnl17CV3asbEpUQx1-cX_apwvCxoS-2UDp7W3pwVXrux2')",
                    }}
                  ></div>
                ) : (
                  <div
                    className={`w-8 h-8 rounded border flex items-center justify-center ${msg.role === "system" ? "bg-obsidian-card border-obsidian-border text-slate-400" : "bg-primary/20 border-primary/30 text-primary shadow-glow"}`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {msg.role === "system" ? "terminal" : "smart_toy"}
                    </span>
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                    {msg.role === "assistant" ? "DataSage API" : msg.role}
                  </span>
                  <span className="text-[10px] text-slate-600">
                    {msg.timestamp}
                  </span>
                </div>

                {/* Main Text Response */}
                {msg.text && (
                  <p
                    className={`text-sm leading-relaxed ${msg.role === "user" ? "text-slate-200" : "text-slate-300"}`}
                  >
                    {msg.text}
                  </p>
                )}

                {/* SQL Query Render (only if exists) */}
                {msg.sqlQuery && (
                  <div className="mt-3 group relative bg-obsidian-dark rounded-lg border border-obsidian-border overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#1A1F2B] border-b border-obsidian-border">
                      <span className="text-xs font-mono text-slate-400">
                        Generated SQL
                      </span>
                      <button
                        className="text-slate-400 hover:text-white transition-colors"
                        title="Copy to clipboard"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          content_copy
                        </span>
                      </button>
                    </div>
                    <div className="p-4 overflow-x-auto custom-scrollbar">
                      <pre className="text-sm font-mono text-emerald-400 whitespace-pre-wrap">
                        <code>{msg.sqlQuery}</code>
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-4 max-w-4xl mx-auto opacity-70">
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 rounded border bg-primary/10 border-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-sm animate-spin">
                    sync
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500">
                    DataSage API
                  </span>
                </div>
                <div className="flex gap-1.5 mt-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Command Bar (Footer) */}
        <div className="shrink-0 p-4 sm:p-6 bg-background-darker border-t border-obsidian-border z-20">
          <div className="max-w-4xl mx-auto flex flex-col gap-3">
            {/* Input Area */}
            <div className="relative group rounded-xl bg-obsidian-card border border-obsidian-border shadow-lg shadow-black/50 transition-all focus-within:ring-1 focus-within:ring-primary/50 focus-within:border-primary/50">
              <div className="flex items-end gap-2 p-2">
                <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors pb-3 hidden sm:block">
                  <span className="material-symbols-outlined">add_circle</span>
                </button>
                <div className="flex-1 min-w-0">
                  <textarea
                    className="w-full bg-transparent border-0 text-slate-100 placeholder-slate-500 focus:ring-0 resize-none py-3 max-h-48 font-mono text-sm outline-none"
                    placeholder="Ask DataSage to orchestrate your database..."
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                  ></textarea>
                </div>
                <div className="flex items-center gap-1 pb-1">
                  <button
                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors hidden sm:block disabled:opacity-50"
                    title="Voice Input"
                    disabled={isLoading}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      mic
                    </span>
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!input.trim() || isLoading}
                    className="p-2 bg-primary hover:bg-primary/90 disabled:bg-obsidian-border disabled:text-slate-500 text-white rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center h-9 w-9"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      arrow_upward
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <p className="text-center text-[10px] text-slate-600 mt-1 font-mono hidden sm:block">
              DataSage can make mistakes. Verify critical schema changes.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
