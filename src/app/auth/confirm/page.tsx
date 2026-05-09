"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function AuthConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/onboarding";

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          console.error("Auth confirm error:", error.message);
          router.replace("/auth?error=auth_callback_failed");
        } else {
          router.replace(next);
        }
      });
    } else {
      router.replace("/auth");
    }
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAF7] dark:bg-[#0F0F11]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
        <p className="text-sm text-[#6B6B6B] dark:text-[#A1A1AA]">Confirming your account...</p>
      </div>
    </div>
  );
}

export default function AuthConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FAFAF7] dark:bg-[#0F0F11]">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
            <p className="text-sm text-[#6B6B6B] dark:text-[#A1A1AA]">Loading...</p>
          </div>
        </div>
      }
    >
      <AuthConfirmContent />
    </Suspense>
  );
}
