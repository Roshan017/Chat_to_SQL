"use client";

import { MessageSquare, Plus, Trash2 } from "lucide-react";

interface SidebarProps {
  chats: string[];
  activeChat: string;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
}

export function Sidebar({
  chats,
  activeChat,
  onSelectChat,
  onNewChat,
  onDeleteChat,
}: SidebarProps) {
  return (
    <div className="w-64 h-full flex flex-col border-r border-white/10 bg-black/20 backdrop-blur-xl shrink-0">
      <div className="p-4 border-b border-white/10">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-xl transition-all border border-white/10 shadow-glass"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
        {chats.map((chat) => (
          <div
            key={chat}
            className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
              activeChat === chat
                ? "bg-indigo-500/20 text-white"
                : "text-white/60 hover:bg-white/5 hover:text-white/90"
            }`}
            onClick={() => onSelectChat(chat)}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <MessageSquare
                className={`w-4 h-4 shrink-0 ${activeChat === chat ? "text-indigo-400" : ""}`}
              />
              <span className="text-sm font-medium truncate">
                Chat {chat.substring(0, 4)}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat(chat);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded-md transition-all text-white/50 hover:text-red-400"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {chats.length === 0 && (
          <div className="text-center text-white/40 text-sm mt-10">
            No chats yet.
          </div>
        )}
      </div>
    </div>
  );
}
