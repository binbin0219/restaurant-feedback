import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "./sign-out-button";
import LocalTime from "./local-time";
import DailySummary from "./daily-summary";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin");
  }

  const { data: feedback, error } = await supabase
    .from("feedback")
    .select("id, message, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">顾客反馈</h1>
          <SignOutButton />
        </div>

        {error && <p className="text-red-600">加载反馈失败。</p>}

        {feedback && feedback.length > 0 && <DailySummary feedback={feedback} />}

        {feedback && feedback.length === 0 && (
          <p className="text-gray-500">暂无反馈。</p>
        )}

        <ul className="space-y-3">
          {feedback?.map((item) => (
            <li key={item.id} className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-900 whitespace-pre-wrap">{item.message}</p>
              <p className="text-xs text-gray-400 mt-2">
                <LocalTime dateString={item.created_at} />
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
