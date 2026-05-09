"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  initializePurchases,
  getOfferings,
  purchasePackage,
  getCustomerInfo,
  checkEntitlement,
  restorePurchases as rcRestorePurchases,
} from "@/lib/revenuecat";

/* ─── Types ──────────────────────────────────────────────────── */
interface SubscriptionState {
  isPro: boolean;
  isLoading: boolean;
  offerings: ReturnType<typeof getOfferings> extends Promise<infer T> ? T : unknown;
  customerInfo: Awaited<ReturnType<typeof getCustomerInfo>> | null;
  error: string | null;
}

interface SubscriptionContextValue extends SubscriptionState {
  purchaseProduct: (pkg: unknown) => Promise<void>;
  restorePurchases: () => Promise<void>;
  refreshCustomerInfo: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

/* ─── Provider ───────────────────────────────────────────────── */
export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SubscriptionState>({
    isPro: false,
    isLoading: true,
    offerings: null,
    customerInfo: null,
    error: null,
  });

  // Check localStorage for cached pro status
  const getCachedProStatus = useCallback((): boolean => {
    try {
      return localStorage.getItem("rankmebaddy_pro") === "true";
    } catch {
      return false;
    }
  }, []);

  const setCachedProStatus = useCallback((isPro: boolean) => {
    try {
      localStorage.setItem("rankmebaddy_pro", String(isPro));
    } catch { /* ignore */ }
  }, []);

  const refreshCustomerInfo = useCallback(async () => {
    try {
      const info = await getCustomerInfo();
      const pro = checkEntitlement(info as Parameters<typeof checkEntitlement>[0]);
      setCachedProStatus(pro);
      setState((prev) => ({
        ...prev,
        customerInfo: info,
        isPro: pro,
        error: null,
      }));
    } catch (error) {
      console.error("[useSubscription] refreshCustomerInfo failed:", error);
    }
  }, [setCachedProStatus]);

  // Initialize on mount
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        await initializePurchases();

        // Load cached pro status immediately
        const cachedPro = getCachedProStatus();
        if (cachedPro) {
          setState((prev) => ({ ...prev, isPro: true }));
        }

        // Fetch real data
        const [offerings, info] = await Promise.all([
          getOfferings().catch(() => null),
          getCustomerInfo().catch(() => null),
        ]);

        if (cancelled) return;

        const pro = info
          ? checkEntitlement(info as Parameters<typeof checkEntitlement>[0])
          : cachedPro;

        setCachedProStatus(pro);

        setState({
          isPro: pro,
          isLoading: false,
          offerings,
          customerInfo: info,
          error: null,
        });
      } catch (error) {
        if (cancelled) return;
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Failed to initialize",
        }));
      }
    }

    init();
    return () => { cancelled = true; };
  }, [getCachedProStatus, setCachedProStatus]);

  const purchaseProduct = useCallback(
    async (pkg: unknown) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const info = await purchasePackage(pkg as Parameters<typeof purchasePackage>[0]);
        const pro = checkEntitlement(info as Parameters<typeof checkEntitlement>[0]);
        setCachedProStatus(pro);
        setState((prev) => ({
          ...prev,
          isPro: pro,
          customerInfo: info,
          isLoading: false,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Purchase failed",
        }));
        throw error;
      }
    },
    [setCachedProStatus]
  );

  const restorePurchasesFn = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const info = await rcRestorePurchases();
      const pro = checkEntitlement(info as Parameters<typeof checkEntitlement>[0]);
      setCachedProStatus(pro);
      setState((prev) => ({
        ...prev,
        isPro: pro,
        customerInfo: info,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Restore failed",
      }));
    }
  }, [setCachedProStatus]);

  return (
    <SubscriptionContext.Provider
      value={{
        ...state,
        purchaseProduct,
        restorePurchases: restorePurchasesFn,
        refreshCustomerInfo,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

/* ─── Hook ───────────────────────────────────────────────────── */
export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    // Return a safe default when used outside provider
    return {
      isPro: false,
      isLoading: false,
      offerings: null,
      customerInfo: null,
      error: null,
      purchaseProduct: async () => {},
      restorePurchases: async () => {},
      refreshCustomerInfo: async () => {},
    };
  }
  return ctx;
}
