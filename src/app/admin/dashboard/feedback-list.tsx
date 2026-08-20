"use client";

import { useEffect, useState } from "react";
import moment from "moment";
import LocalTime from "./local-time";

type FeedbackRow = { id: string; message: string; created_at: string };
type Group = { day: string; items: FeedbackRow[] };

export default function FeedbackList({ feedback }: { feedback: FeedbackRow[] }) {
  const [groups, setGroups] = useState<Group[] | null>(null);

  useEffect(() => {
    const byDay = new Map<string, FeedbackRow[]>();
    for (const item of feedback) {
      const day = moment(item.created_at).format("YYYY-MM-DD");
      const items = byDay.get(day) ?? [];
      items.push(item);
      byDay.set(day, items);
    }
    const sorted = Array.from(byDay.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([day, items]) => ({ day, items }));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- computing in the browser's timezone, matches local-time.tsx
    setGroups(sorted);
  }, [feedback]);

  if (groups === null) {
    return <p className="text-sm text-gray-400">统计中...</p>;
  }

  return (
    <div className="space-y-6">
      {groups.map(({ day, items }) => (
        <div key={day}>
          <h2 className="text-sm font-medium text-gray-500 mb-2">
            {day} · {items.length} 条
          </h2>
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id} className="bg-white rounded-lg shadow p-4">
                <p className="text-gray-900 whitespace-pre-wrap">{item.message}</p>
                <p className="text-xs text-gray-400 mt-2">
                  <LocalTime dateString={item.created_at} />
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
