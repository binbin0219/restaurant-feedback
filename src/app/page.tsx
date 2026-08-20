"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Home() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus("submitting");
    const supabase = createClient();
    const { error } = await supabase.from("feedback").insert({ message: message.trim() });

    if (error) {
      setStatus("error");
      return;
    }

    setMessage("");
    setStatus("done");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-semibold mb-2 text-gray-900">
          告诉我们您的想法
        </h1>
        <p className="text-gray-500 mb-6">
          您的反馈能帮助我们做得更好，只需花您一点时间。
        </p>

        {status === "done" ? (
          <div className="text-center py-8">
            <p className="text-lg font-medium text-gray-900">谢谢您！</p>
            <p className="text-gray-500 mt-1">我们已收到您的反馈。</p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-4 text-sm text-blue-600 hover:underline"
            >
              再提交一条反馈
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="分享您的用餐体验..."
              rows={5}
              maxLength={2000}
              required
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full bg-blue-600 text-white rounded-lg py-2.5 font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {status === "submitting" && (
                <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              )}
              {status === "submitting" ? "提交中..." : "提交反馈"}
            </button>
            {status === "error" && (
              <p className="text-sm text-red-600">
                出了点问题，请重试。
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
