"use client";

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

type MessageListProps = {
  messages: Message[];
  currentUserId: string;
};

export default function MessageList({ messages, currentUserId }: MessageListProps) {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">管理者</span>;
      case "STAFF":
        return <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">スタッフ</span>;
      case "USER":
        return <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">出展者</span>;
      default:
        return null;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ja-JP", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        メッセージはまだありません
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        const isOwnMessage = message.sender.id === currentUserId;
        return (
          <div
            key={message.id}
            className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                isOwnMessage
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold">
                  {message.sender.name || message.sender.email}
                </span>
                {getRoleBadge(message.sender.role)}
              </div>
              <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  isOwnMessage ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {formatTime(message.createdAt)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
