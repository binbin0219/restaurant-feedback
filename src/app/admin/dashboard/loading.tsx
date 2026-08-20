export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="h-7 w-28 rounded bg-gray-200" />
          <div className="h-4 w-16 rounded bg-gray-200" />
        </div>

        <ul className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="bg-white rounded-lg shadow p-4">
              <div className="h-4 w-full rounded bg-gray-200" />
              <div className="h-4 w-2/3 rounded bg-gray-200 mt-2" />
              <div className="h-3 w-24 rounded bg-gray-200 mt-3" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
