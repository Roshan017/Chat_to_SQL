"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/chat/Sidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export default function ChatPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [chats, setChats] = useState<string[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);

  useEffect(() => {
    // Load state on mount
    const storedUserId = localStorage.getItem("datasage_user_id");
    if (!storedUserId) {
      router.push("/");
      return;
    }
    setUserId(storedUserId);

    const storedChats = localStorage.getItem(`datasage_chats_${storedUserId}`);
    if (storedChats) {
      const parsed = JSON.parse(storedChats);
      setChats(parsed);
      if (parsed.length > 0) setActiveChat(parsed[0]);
    } else {
      handleNewChat();
    }
  }, [router]);

  const saveChats = (newChats: string[]) => {
    if (!userId) return;
    setChats(newChats);
    localStorage.setItem(`datasage_chats_${userId}`, JSON.stringify(newChats));
  };

  const handleNewChat = () => {
    const newId = Date.now().toString();
    saveChats([newId, ...chats]);
    setActiveChat(newId);
  };

  const handleDeleteChat = (idToDelete: string) => {
    const updated = chats.filter((c) => c !== idToDelete);
    saveChats(updated);
    localStorage.removeItem(`datasage_history_${idToDelete}`);

    if (activeChat === idToDelete) {
      setActiveChat(updated.length > 0 ? updated[0] : null);
    }
  };

  if (!userId) return null;

  return (
    <main className="h-screen w-full flex overflow-hidden font-[family-name:var(--font-sans)]">
      <RevealOnScroll className="h-full" delay={0}>
        <Sidebar
          chats={chats}
          activeChat={activeChat || ""}
          onSelectChat={setActiveChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
        />
      </RevealOnScroll>

      <div className="flex-1 p-4 h-full relative z-10 w-full overflow-hidden">
        {activeChat ? (
          <RevealOnScroll className="h-full w-full" delay={0.1}>
            <ChatWindow key={activeChat} chatId={activeChat} userId={userId} />
          </RevealOnScroll>
        ) : (
          <div className="h-full flex items-center justify-center text-white/50">
            Create or select a chat to begin
          </div>
        )}
      </div>
    </main>
  );
}
