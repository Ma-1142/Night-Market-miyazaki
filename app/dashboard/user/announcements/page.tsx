"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AnnouncementList from "@/components/chat/AnnouncementList";

type Message = {
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

export default function UserAnnouncementsPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [chatRoomId, setChatRoomId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser();
    fetchChatRoom();
  }, []);

  useEffect(() => {
    if (chatRoomId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [chatRoomId]);

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

  const fetchChatRoom = async () => {
    try {
      const response = await fetch("/api/chat/rooms");
      if (response.ok) {
        const rooms = await response.json();
        if (rooms.length > 0) {
          setChatRoomId(rooms[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch chat room:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!chatRoomId) return;

    try {
      const response = await fetch(`/api/chat/${chatRoomId}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

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
              <h1 className="text-3xl font-bold">運営からのお知らせ</h1>
              <p className="mt-2 text-gray-600">
                管理者からの重要なお知らせを確認できます
              </p>
            </div>
            <Link
              href="/dashboard/user/direct-chat"
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              個別チャット
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md flex flex-col h-[calc(100vh-16rem)]">
          <div className="border-b p-6 bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-2xl font-bold">お知らせボード</h2>
                <p className="text-sm mt-1 opacity-90">
                  運営からの重要なお知らせが掲示されます（閲覧専用）
                </p>
              </div>
            </div>
          </div>
          <AnnouncementList messages={messages} />
          <div className="border-t p-4 bg-yellow-50">
            <p className="text-sm text-gray-700 text-center">
              個別の質問や相談は
              <Link href="/dashboard/user/direct-chat" className="text-blue-600 hover:underline mx-1 font-semibold">
                個別チャット
              </Link>
              からお願いします
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
