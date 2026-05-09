"use client";

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from "react";

interface CreditsState {
  creditsRemaining: number;
  totalUsed: number;
  nextReset: string | null;
  loading: boolean;
  deductCredit: () => Promise<boolean>;
  refreshCredits: () => Promise<void>;
}

const CreditsContext = createContext<CreditsState>({
  creditsRemaining: 10,
  totalUsed: 0,
  nextReset: null,
  loading: true,
  deductCredit: async () => true,
  refreshCredits: async () => {},
});

export function CreditsProvider({ children }: { children: ReactNode }) {
  const [creditsRemaining, setCreditsRemaining] = useState(10);
  const [totalUsed, setTotalUsed] = useState(0);
  const [nextReset, setNextReset] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshCredits = useCallback(async () => {
    try {
      const userId = localStorage.getItem("rankmebaddy_user_id");
      if (!userId) { setLoading(false); return; }

      const res = await fetch(`/api/credits`, {
        headers: { "x-user-id": userId },
      });
      if (res.ok) {
        const data = await res.json();
        setCreditsRemaining(data.credits_remaining);
        setTotalUsed(data.total_used);
        setNextReset(data.next_reset);
      }
    } catch {
      // Credits fetch failed, use defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCredits();
  }, [refreshCredits]);

  const deductCredit = useCallback(async (): Promise<boolean> => {
    try {
      const userId = localStorage.getItem("rankmebaddy_user_id");
      if (!userId) return true; // Allow if no user ID stored

      const res = await fetch("/api/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        const data = await res.json();
        setCreditsRemaining(data.credits_remaining);
        if (!data.allowed) {
          return false;
        }
        return true;
      }
      return true; // Allow on error
    } catch {
      return true; // Allow on error
    }
  }, []);

  return (
    <CreditsContext.Provider value={{ creditsRemaining, totalUsed, nextReset, loading, deductCredit, refreshCredits }}>
      {children}
    </CreditsContext.Provider>
  );
}

export const useCredits = () => useContext(CreditsContext);
