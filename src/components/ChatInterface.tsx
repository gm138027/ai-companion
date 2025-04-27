"use client";

import { useState, useRef, useEffect } from "react";
import { Character } from "@/lib/characters";
import ChatMessage from "@/components/ChatMessage";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  character: Character;
}

export default function ChatInterface({ character }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hey there! I'm ${character.name}. ${
        character.gender === "male" ? "I'm" : "I'm"
      } really happy to meet you! How's your day going?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === "" || isLoading) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          characterId: character.id,
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role === "user" ? "user" : "model",
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "请求失败");
      }

      const data = await response.json();
      const aiResponse = {
        role: "assistant" as const,
        content: data.response,
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("发送消息时出错:", error);
      
      // 显示更具体的错误消息
      let errorMessage = "对不起，我现在无法回应。请稍后再试。";
      if (error.message.includes("API密钥")) {
        errorMessage = "系统配置错误: API密钥问题";
      } else if (error.message.includes("网络")) {
        errorMessage = "无法连接到AI服务，请检查网络";
      }
      
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorMessage
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="relative h-10 w-10 overflow-hidden rounded-full">
            <img
              src={character.avatar}
              alt={character.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{character.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {character.personality}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            content={message.content}
            role={message.role}
            avatarSrc={message.role === "assistant" ? character.avatar : undefined}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-4 flex items-center border-t border-gray-200 p-4 dark:border-gray-700"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-l-lg border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="rounded-r-lg bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}