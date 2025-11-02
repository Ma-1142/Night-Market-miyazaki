"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";

type DirectMessage = {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
};

export default function UserDirectChatPage() {
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [adminId, setAdminId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser();
    fetchAdmin();
  }, []);

  useEffect(() => {
    if (adminId && currentUserId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [adminId, currentUserId]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("/api/auth/session");
      const session = await response.json();
      if (session?.user?.id) {
        setCurrentUserId(session.user.id);
      }
    } catch (error) {
      console.error("Failed to fetch current user:", error);
    }
  };

  const fetchAdmin = async () => {
    try {
      // Get admin user ID by fetching a message from announcement board
      const roomsResponse = await fetch("/api/chat/rooms");
      if (roomsResponse.ok) {
        const rooms = await roomsResponse.json();
        if (rooms.length > 0) {
          const messagesResponse = await fetch(
            `/api/chat/${rooms[0].id}/messages`
          );
          if (messagesResponse.ok) {
            const msgs = await messagesResponse.json();
            if (msgs.length > 0) {
              setAdminId(msgs[0].sender.id);
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch admin:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!adminId) return;

    try {
      const response = await fetch(`/api/direct-messages?userId=${adminId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!adminId) return;

    const response = await fetch("/api/direct-messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: adminId, content }),
    });

    if (response.ok) {
      await fetchMessages();
    } else {
      throw new Error("Failed to send message");
    }
  };

  const formattedMessages = messages.map((msg) => ({
    id: msg.id,
    content: msg.content,
    createdAt: msg.createdAt,
    sender: msg.sender,
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link
            href="/dashboard/user"
            className="text-blue-600 hover:underline mb-2 inline-block"
          >
            ← ダッシュボードに戻る
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">管理者との個別チャット</h1>
              <p className="mt-2 text-gray-600">
                質問や相談がある場合はこちらからメッセージを送信してください
              </p>
            </div>
            <Link
              href="/dashboard/user/announcements"
              className="rounded-md bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700"
            >
              お知らせ
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md flex flex-col h-[calc(100vh-16rem)]">
          <div className="border-b p-4">
            <h2 className="text-xl font-bold">管理者とのやり取り</h2>
            <p className="text-sm text-gray-600 mt-1">
              こちらでは管理者と直接メッセージをやり取りできます
            </p>
          </div>
          <MessageList messages={formattedMessages} currentUserId={currentUserId} />
          <MessageInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}
