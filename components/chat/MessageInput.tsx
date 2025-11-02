"use client";

import { useState } from "react";

type MessageInputProps = {
  onSendMessage: (content: string) => Promise<void>;
  disabled?: boolean;
};

export default function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() || isSending) return;

    setIsSending(true);
    try {
      await onSendMessage(content.trim());
      setContent("");
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("メッセージの送信に失敗しました");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t bg-white p-4">
      <div className="flex gap-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="メッセージを入力..."
          disabled={disabled || isSending}
          rows={3}
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none disabled:bg-gray-100 resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button
          type="submit"
          disabled={!content.trim() || disabled || isSending}
          className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed self-end"
        >
          {isSending ? "送信中..." : "送信"}
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Shift + Enter で改行、Enter で送信
      </p>
    </form>
  );
}
