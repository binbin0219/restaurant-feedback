"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { startLoading } from "@/lib/loading-bar";

export default function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    startLoading();
    router.push("/admin");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="text-sm text-gray-500 hover:text-gray-900 disabled:opacity-50 inline-flex items-center gap-1.5"
    >
      {loading && (
        <span className="h-3.5 w-3.5 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
      )}
      退出登录
    </button>
  );
}
