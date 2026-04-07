"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export const ADMIN_SESSION_KEY = "admin_session_expires_at";
export const ADMIN_SESSION_DURATION_MS = 60 * 60 * 1000; // 1 hour

export function useAdminSessionTimeout() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const forceLogout = async () => {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      await supabase.auth.signOut();
      router.replace("/admin/login");
    };

    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    const expiresAt = raw ? parseInt(raw, 10) : 0;

    if (!expiresAt || Date.now() >= expiresAt) {
      forceLogout();
      return;
    }

    const timer = setTimeout(forceLogout, expiresAt - Date.now());
    return () => clearTimeout(timer);
  }, [router]);
}
