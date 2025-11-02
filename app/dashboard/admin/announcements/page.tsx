"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AnnouncementList from "@/components/chat/AnnouncementList";
import Link from "next/link";

type ChatRoom = {
  id: string;
  name: string;
  type: string;
};

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

export default function AdminAnnouncementsPage() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchChatRooms();
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (selectedRoomId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedRoomId]);

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

  const fetchChatRooms = async () => {
    try {
      const response = await fetch("/api/chat/rooms");
      if (response.ok) {
        const rooms = await response.json();
        setChatRooms(rooms);
        if (rooms.length > 0 && !selectedRoomId) {
          setSelectedRoomId(rooms[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch chat rooms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedRoomId) return;

    try {
      const response = await fetch(`/api/chat/${selectedRoomId}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const handleSendToSelected = async () => {
    if (!selectedRoomId || !content.trim()) return;

    setIsSending(true);
    try {
      const response = await fetch(`/api/chat/${selectedRoomId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });

      if (response.ok) {
        setContent("");
        await fetchMessages();
      } else {
        alert("お知らせの送信に失敗しました");
      }
    } catch (error) {
      alert("エラーが発生しました");
    } finally {
      setIsSending(false);
    }
  };

  const handleSendToAll = async () => {
    if (!content.trim()) return;

    if (!confirm("全員にお知らせを送信しますか？")) return;

    setIsSending(true);
    try {
      const response = await fetch("/api/chat/bulk-announce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });

      if (response.ok) {
        setContent("");
        await fetchMessages();
        alert("全員にお知らせを送信しました");
      } else {
        alert("お知らせの送信に失敗しました");
      }
    } catch (error) {
      alert("エラーが発生しました");
    } finally {
      setIsSending(false);
    }
  };

  const selectedRoom = chatRooms.find((room) => room.id === selectedRoomId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="p-8 pl-20">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="p-8 pl-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">お知らせボード</h1>
              <p className="mt-2 text-gray-600">出展者・スタッフへのお知らせ送信</p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/dashboard/admin/direct-chat"
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                個別チャット
              </Link>
              <Link
                href="/api/auth/signout"
                className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                ログアウト
              </Link>
            </div>
          </div>

          <div className="flex gap-6 h-[calc(100vh-16rem)]">
            {/* Chat room list */}
            <div className="w-64 bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-bold mb-4">対象選択</h2>
              <div className="space-y-2">
                {chatRooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoomId(room.id)}
                    className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                      selectedRoomId === room.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    <div className="font-semibold">{room.name}</div>
                    <div className="text-sm opacity-75">
                      {room.type === "USER" ? "出展者向け" : "スタッフ向け"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Announcement area */}
            <div className="flex-1 bg-white rounded-lg shadow-md flex flex-col">
              <div className="border-b p-6 bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
                <div className="flex items-center gap-3">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedRoom?.name}</h2>
                    <p className="text-sm mt-1 opacity-90">
                      {selectedRoom?.type === "USER" ? "出展者" : "スタッフ"}向けのお知らせボード
                    </p>
                  </div>
                </div>
              </div>
              <AnnouncementList messages={messages} />
              <div className="border-t bg-white p-4">
                <div className="flex flex-col gap-3">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-2">
                    <p className="text-sm text-gray-700">
                      ここから{selectedRoom?.type === "USER" ? "出展者" : "スタッフ"}全員にお知らせを送信できます
                    </p>
                  </div>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="お知らせ内容を入力..."
                    disabled={isSending}
                    rows={4}
                    className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 focus:outline-none disabled:bg-gray-100 resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSendToSelected}
                      disabled={!content.trim() || isSending}
                      className="flex-1 rounded-md bg-yellow-600 px-6 py-3 text-white font-semibold hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isSending ? "送信中..." : `${selectedRoom?.type === "USER" ? "出展者のみ" : "スタッフのみ"}に送信`}
                    </button>
                    <button
                      onClick={handleSendToAll}
                      disabled={!content.trim() || isSending}
                      className="flex-1 rounded-md bg-green-600 px-6 py-3 text-white font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isSending ? "送信中..." : "全員に一斉送信"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
