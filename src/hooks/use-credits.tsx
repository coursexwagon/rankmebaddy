"use client";

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from "react";

type Tier = "free" | "pro" | "enterprise";

interface CreditsState {
  creditsRemaining: number;
  maxCredits: number;
  totalUsed: number;
  totalRefunded: number;
  tier: Tier;
  nextReset: string | null;
  loading: boolean;
  error: string | null;
  /** Refresh credits from the server (does NOT deduct) */
  refreshCredits: () => Promise<void>;
}

const CreditsContext = createContext<CreditsState>({
  creditsRemaining: 0,
  maxCredits: 25,
  totalUsed: 0,
  totalRefunded: 0,
  tier: "free",
  nextReset: null,
  loading: true,
  error: null,
  refreshCredits: async () => {},
});

export function CreditsProvider({ children }: { children: ReactNode }) {
  const [creditsRemaining, setCreditsRemaining] = useState(0);
  const [maxCredits, setMaxCredits] = useState(25);
  const [totalUsed, setTotalUsed] = useState(0);
  const [totalRefunded, setTotalRefunded] = useState(0);
  const [tier, setTier] = useState<Tier>("free");
  const [nextReset, setNextReset] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCredits = useCallback(async () => {
    try {
      setError(null);
      const userId = localStorage.getItem("rankmebaddy_user_id");
      if (!userId) {
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/credits`, {
        headers: { "x-user-id": userId },
      });

      if (res.ok) {
        const data = await res.json();
        setCreditsRemaining(data.credits_remaining);
        setMaxCredits(data.max_credits ?? 25);
        setTotalUsed(data.total_used ?? 0);
        setTotalRefunded(data.total_refunded ?? 0);
        setTier(data.tier ?? "free");
        setNextReset(data.next_reset);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to fetch credits");
        // On error, set credits to 0 (fail-closed)
        setCreditsRemaining(0);
      }
    } catch (err) {
      setError("Network error fetching credits");
      // Fail-closed: assume no credits on error
      setCreditsRemaining(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCredits();

    // Refresh credits every 30 seconds to keep countdown accurate
    const interval = setInterval(refreshCredits, 30000);
    return () => clearInterval(interval);
  }, [refreshCredits]);

  return (
    <CreditsContext.Provider
      value={{
        creditsRemaining,
        maxCredits,
        totalUsed,
        totalRefunded,
        tier,
        nextReset,
        loading,
        error,
        refreshCredits,
      }}
    >
      {children}
    </CreditsContext.Provider>
  );
}

export const useCredits = () => useContext(CreditsContext);
