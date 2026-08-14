// app/chatbot/page.tsx - Chatbot pertanian
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot, User } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" |"assistant";
  content: string;
  sources?: string[];
}

export default function ChatbotPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setInput("");

    try {
      const res = await api.post("/api/chatbot/ask", {
        question: input,
        session_id: "default-session",
      });

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: res.data.answer,
        sources: res.data.sources || [],
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: err?.response?.data?.detail || "Gagal mendapatkan respons. Coba lagi.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-green-700">Chatbot Pertanian</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle>Tanya pertanyaan pertanian</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto mb-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>Silakan bertanya tentang budidaya kakao atau padi</p>
                <p className="mt-2">Contoh: "Cara mengatasi hama penggulung daun kakao?"</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.role === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {msg.role === "assistant" ? (
                          <Bot className="h-5 w-5 mt-0.5" />
                        ) : (
                          <User className="h-5 w-5 mt-0.5" />
                        )}
                        <div>
                          <p className="text-sm">{msg.content}</p>
                          {msg.sources && msg.sources.length > 0 && (
                            <div className="mt-2 text-xs opacity-75">
                              <p className="font-medium">Sumber:</p>
                              {msg.sources.map((src, i) => (
                                <p key={i}>• {src}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] p-3 rounded-lg bg-gray-100">
                      <Bot className="h-5 w-5 animate-bounce" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </CardContent>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ketikan pertanyaan Anda..."
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                disabled={loading}
              />
              <Button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
