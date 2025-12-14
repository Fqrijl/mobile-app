import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { MessageSquare, Send, CheckCircle, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function MessageManagement() {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState("");
  const queryClient = useQueryClient();

  const { data: messages = [] } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: () => base44.entities.Message.list("-created_date"),
  });

  const replyMutation = useMutation({
    mutationFn: async ({ messageId, replyText }) => {
      await base44.entities.Message.update(messageId, {
        admin_reply: replyText,
        status: "replied",
        replied_at: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
      setSelectedMessage(null);
      setReply("");
      toast.success("Balasan berhasil dikirim");
    },
  });

  const closeMessageMutation = useMutation({
    mutationFn: async (messageId) => {
      await base44.entities.Message.update(messageId, { status: "closed" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
      toast.success("Pesan ditutup");
    },
  });

  const handleReply = () => {
    if (!reply.trim()) {
      toast.error("Tulis balasan terlebih dahulu");
      return;
    }
    replyMutation.mutate({ messageId: selectedMessage.id, replyText: reply });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        label: "Menunggu",
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
      },
      replied: {
        label: "Dibalas",
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
      },
      closed: { label: "Ditutup", color: "bg-gray-100 text-gray-800", icon: X },
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}
      >
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold">
                    {message.user_name || message.user_email}
                  </h3>
                  {getStatusBadge(message.status)}
                </div>
                {message.subject && (
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    {message.subject}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  {new Date(message.created_date).toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {message.message}
              </p>
            </div>

            {message.admin_reply && (
              <div className="bg-blue-50 rounded-lg p-4 mb-4 border-l-4 border-blue-500">
                <p className="text-xs text-blue-600 font-medium mb-2">
                  Balasan Admin:
                </p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {message.admin_reply}
                </p>
                {message.replied_at && (
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(message.replied_at).toLocaleString("id-ID")}
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-2">
              {message.status === "pending" && (
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedMessage(message);
                    setReply("");
                  }}
                  className="bg-black hover:bg-gray-800"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Balas
                </Button>
              )}
              {message.status !== "closed" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => closeMessageMutation.mutate(message.id)}
                >
                  Tutup
                </Button>
              )}
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Belum ada pesan</p>
          </div>
        )}
      </div>

      <Dialog
        open={!!selectedMessage}
        onOpenChange={() => setSelectedMessage(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Balas Pesan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium mb-2">
                {selectedMessage?.user_name}
              </p>
              <p className="text-sm text-gray-700">
                {selectedMessage?.message}
              </p>
            </div>
            <Textarea
              placeholder="Tulis balasan Anda..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={5}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setSelectedMessage(null)}
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                onClick={handleReply}
                disabled={replyMutation.isPending}
                className="flex-1 bg-black hover:bg-gray-800"
              >
                {replyMutation.isPending ? "Mengirim..." : "Kirim Balasan"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
