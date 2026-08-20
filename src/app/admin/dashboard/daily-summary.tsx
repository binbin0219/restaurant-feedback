"use client";

import { useEffect, useState } from "react";
import moment from "moment";

type FeedbackRow = { id: string; created_at: string };

export default function DailySummary({ feedback }: { feedback: FeedbackRow[] }) {
  const [dailyCounts, setDailyCounts] = useState<[string, number][] | null>(null);

  useEffect(() => {
    const counts = new Map<string, number>();
    for (const item of feedback) {
      const day = moment(item.created_at).format("YYYY-MM-DD");
      counts.set(day, (counts.get(day) ?? 0) + 1);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- computing in the browser's timezone, matches local-time.tsx
    setDailyCounts(Array.from(counts.entries()).sort((a, b) => b[0].localeCompare(a[0])));
  }, [feedback]);

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <p className="text-sm text-gray-500">
        总反馈数 <span className="text-gray-900 font-semibold">{feedback.length}</span>
      </p>
      <ul className="mt-3 space-y-1.5">
        {dailyCounts === null ? (
          <li className="text-sm text-gray-400">统计中...</li>
        ) : (
          dailyCounts.map(([day, count]) => (
            <li key={day} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{day}</span>
              <span className="text-gray-900 font-medium">{count} 条</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
