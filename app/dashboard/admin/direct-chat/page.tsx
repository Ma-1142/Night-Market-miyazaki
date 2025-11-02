"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";
import Link from "next/link";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
};

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
  receiver: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
};

export default function AdminDirectChatPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "USER" | "STAFF">("ALL");

  useEffect(() => {
    fetchCurrentUser();
    fetchUsers();
  }, [filter]);

  useEffect(() => {
    if (selectedUserId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedUserId]);

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

  const fetchUsers = async () => {
    try {
      const url = filter === "ALL" ? "/api/users" : `/api/users?role=${filter}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedUserId) return;

    try {
      const response = await fetch(`/api/direct-messages?userId=${selectedUserId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedUserId) return;

    const response = await fetch("/api/direct-messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: selectedUserId, content }),
    });

    if (response.ok) {
      await fetchMessages();
    } else {
      throw new Error("Failed to send message");
    }
  };

  const selectedUser = users.find((u) => u.id === selectedUserId);

  // Convert DirectMessage to Message format for MessageList
  const formattedMessages = messages.map((msg) => ({
    id: msg.id,
    content: msg.content,
    createdAt: msg.createdAt,
    sender: msg.sender,
  }));

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
              <h1 className="text-3xl font-bold">個別チャット</h1>
              <p className="mt-2 text-gray-600">出展者・スタッフとの個別やり取り</p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/dashboard/admin/announcements"
                className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                お知らせボード
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
            {/* User list */}
            <div className="w-80 bg-white rounded-lg shadow-md flex flex-col">
              <div className="p-4 border-b">
                <h2 className="text-lg font-bold mb-3">ユーザー一覧</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter("ALL")}
                    className={`flex-1 px-3 py-1 text-sm rounded ${
                      filter === "ALL"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    全て
                  </button>
                  <button
                    onClick={() => setFilter("USER")}
                    className={`flex-1 px-3 py-1 text-sm rounded ${
                      filter === "USER"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    出展者
                  </button>
                  <button
                    onClick={() => setFilter("STAFF")}
                    className={`flex-1 px-3 py-1 text-sm rounded ${
                      filter === "STAFF"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    スタッフ
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {users.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    ユーザーがいません
                  </div>
                ) : (
                  <div className="space-y-2">
                    {users.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => setSelectedUserId(user.id)}
                        className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                          selectedUserId === user.id
                            ? "bg-blue-600 text-white"
                            : "bg-gray-50 text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="font-semibold truncate">
                            {user.name || user.email}
                          </div>
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${
                              selectedUserId === user.id
                                ? "bg-blue-500 text-white"
                                : user.role === "USER"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {user.role === "USER" ? "出展者" : "スタッフ"}
                          </span>
                        </div>
                        {user.name && (
                          <div className="text-xs opacity-75 truncate mt-1">
                            {user.email}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chat area */}
            <div className="flex-1 bg-white rounded-lg shadow-md flex flex-col">
              {selectedUser ? (
                <>
                  <div className="border-b p-4">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold">
                        {selectedUser.name || selectedUser.email}
                      </h2>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          selectedUser.role === "USER"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {selectedUser.role === "USER" ? "出展者" : "スタッフ"}
                      </span>
                    </div>
                    {selectedUser.name && (
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedUser.email}
                      </p>
                    )}
                  </div>
                  <MessageList
                    messages={formattedMessages}
                    currentUserId={currentUserId}
                  />
                  <MessageInput onSendMessage={handleSendMessage} />
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  左側からユーザーを選択してください
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
