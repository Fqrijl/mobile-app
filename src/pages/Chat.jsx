import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Send, Paperclip, Loader2, User, Headphones } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import moment from "moment";

export default function Chat() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth
      .me()
      .then(setUser)
      .catch(() => {});
  }, []);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["chat-messages", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      return base44.entities.ChatMessage.filter(
        { user_email: user.email },
        "created_date"
      );
    },
    enabled: !!user?.email,
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (text) => {
      await base44.entities.ChatMessage.create({
        user_email: user.email,
        message: text,
        sender: "user",
        is_read: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-messages"] });
      setMessage("");
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessageMutation.mutate(message);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
        <Headphones className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-lg font-bold mb-2">Chat Customer Service</h2>
        <p className="text-gray-500 text-center mb-6">
          Silakan login untuk memulai chat dengan admin
        </p>
        <button
          onClick={() => base44.auth.redirectToLogin()}
          className="bg-black text-white px-8 py-3 rounded-full font-medium"
        >
          Login
        </button>
      </div>
    );
  }

  // Group messages by date
  const groupedMessages = messages.reduce((groups, msg) => {
    const date = moment(msg.created_date).format("YYYY-MM-DD");
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
    return groups;
  }, {});

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
          <Headphones className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-bold">Customer Service</h2>
          <p className="text-xs text-green-500">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Headphones className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">Belum ada pesan</p>
            <p className="text-sm text-gray-400">
              Mulai chat dengan admin untuk bantuan
            </p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date}>
              <div className="text-center mb-4">
                <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full">
                  {moment(date).calendar(null, {
                    sameDay: "[Hari ini]",
                    lastDay: "[Kemarin]",
                    lastWeek: "dddd",
                    sameElse: "DD MMM YYYY",
                  })}
                </span>
              </div>

              <AnimatePresence>
                {msgs.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex mb-3 ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.sender === "admin" && (
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                        <Headphones className="w-4 h-4 text-white" />
                      </div>
                    )}

                    <div
                      className={`max-w-[75%] ${
                        msg.sender === "user" ? "order-1" : ""
                      }`}
                    >
                      <div
                        className={`rounded-2xl px-4 py-2.5 ${
                          msg.sender === "user"
                            ? "bg-black text-white rounded-br-md"
                            : "bg-white border rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      </div>
                      <p
                        className={`text-[10px] text-gray-400 mt-1 ${
                          msg.sender === "user" ? "text-right" : ""
                        }`}
                      >
                        {moment(msg.created_date).format("HH:mm")}
                      </p>
                    </div>

                    {msg.sender === "user" && (
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center ml-2 flex-shrink-0">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {messages.length === 0 && (
        <div className="px-4 py-2 bg-white border-t flex gap-2 overflow-x-auto">
          {[
            "Tanya stok produk",
            "Status pesanan",
            "Cara pembayaran",
            "Komplain produk",
          ].map((text) => (
            <button
              key={text}
              onClick={() => setMessage(text)}
              className="px-4 py-2 bg-gray-100 rounded-full text-sm whitespace-nowrap"
            >
              {text}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t p-4">
        <div className="flex items-end gap-2">
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Paperclip className="w-5 h-5" />
          </button>

          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ketik pesan..."
              rows={1}
              className="w-full px-4 py-3 bg-gray-100 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-black/10 text-sm"
              style={{ maxHeight: "120px" }}
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!message.trim() || sendMessageMutation.isPending}
            className={`p-3 rounded-full transition-colors ${
              message.trim()
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {sendMessageMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
