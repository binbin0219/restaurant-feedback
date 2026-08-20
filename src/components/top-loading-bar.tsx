"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { subscribeLoading, startLoading } from "@/lib/loading-bar";

export default function TopLoadingBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearTimers() {
    if (timerRef.current) clearInterval(timerRef.current);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
  }

  function begin() {
    clearTimers();
    setVisible(true);
    setProgress(8);
    timerRef.current = setInterval(() => {
      setProgress((p) => (p < 90 ? p + (90 - p) * 0.1 : p));
    }, 150);
  }

  function finish() {
    clearTimers();
    setProgress(100);
    hideTimeoutRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 200);
  }

  useEffect(() => {
    const unsubscribe = subscribeLoading((active) => {
      if (active) begin();
      else finish();
    });
    return unsubscribe;
  }, []);

  // Complete the bar whenever the route actually changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing with external route change, not derived render state
    finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  // Give instant feedback for <Link> clicks too, not just manual router.push calls.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement)?.closest?.("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      if (anchor.target && anchor.target !== "_self") return;

      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      startLoading();
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => clearTimers, []);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent pointer-events-none">
      <div
        className="h-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)] transition-[width,opacity] duration-200 ease-out"
        style={{ width: `${progress}%`, opacity: progress === 100 ? 0 : 1 }}
      />
    </div>
  );
}
