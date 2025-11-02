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

type AnnouncementListProps = {
  messages: Message[];
};

export default function AnnouncementList({ messages }: AnnouncementListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">📭</div>
          <p>お知らせはまだありません</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <div className="space-y-4 max-w-4xl mx-auto">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className="bg-white rounded-lg shadow-md border-l-4 border-yellow-500 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">
                  運営
                </div>
                <div>
                  <div className="font-bold text-gray-900">
                    {message.sender.name || "管理者"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(message.createdAt)}
                  </div>
                </div>
              </div>
              <div className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-semibold">
                お知らせ #{messages.length - index}
              </div>
            </div>
            <div className="pl-13">
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                {message.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
