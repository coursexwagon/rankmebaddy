"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSubscription } from "@/hooks/use-subscription";

/* ─── Customer Center Component ──────────────────────────────── */
interface CustomerCenterProps {
  onUpgrade: () => void;
}

export function CustomerCenter({ onUpgrade }: CustomerCenterProps) {
  const { isPro, isLoading, customerInfo, restorePurchases, error } = useSubscription();
  const [restoring, setRestoring] = useState(false);
  const [restoreMsg, setRestoreMsg] = useState<string | null>(null);

  const handleRestore = async () => {
    setRestoring(true);
    setRestoreMsg(null);
    try {
      await restorePurchases();
      setRestoreMsg("Purchases restored successfully!");
    } catch {
      setRestoreMsg("Could not find any purchases to restore.");
    } finally {
      setRestoring(false);
      setTimeout(() => setRestoreMsg(null), 4000);
    }
  };

  // Extract subscription details from customerInfo
  const activeEntitlements = customerInfo?.entitlements?.active
    ? Object.keys(customerInfo.entitlements.active as Record<string, any>)
    : [];
  const allEntitlements = customerInfo?.entitlements?.all
    ? Object.entries(customerInfo.entitlements.all as Record<string, any>)
    : [];

  const expirationDate = (() => {
    try {
      const proEntitlement = allEntitlements.find(([key]) => key === "rankmebaddy Pro");
      if (proEntitlement?.[1]?.expirationDate) {
        return new Date(proEntitlement[1].expirationDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
    } catch {}
    return null;
  })();

  const purchaseDate = (() => {
    try {
      const proEntitlement = allEntitlements.find(([key]) => key === "rankmebaddy Pro");
      if (proEntitlement?.[1]?.purchaseDate) {
        return new Date(proEntitlement[1].purchaseDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
    } catch {}
    return null;
  })();

  return (
    <div className="space-y-5">
      {/* Current Plan */}
      <motion.div
        className="rounded-2xl border border-[#E8E5E0] dark:border-[#2A2A2E] bg-white dark:bg-[#1E1E22] p-5 shadow-sm"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-sm font-bold text-[#1A1A1A] dark:text-white">Current Plan</h3>
            <p className="mt-0.5 text-[11px] text-[#9B9B9B]">Your subscription status</p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${
              isPro
                ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800"
                : "bg-[#F5F5F0] dark:bg-[#2A2A2E] text-[#6B6B6B] dark:text-[#9B9B9B] border border-[#E8E5E0] dark:border-[#333]"
            }`}
          >
            {isPro ? (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Pro
              </>
            ) : (
              "Free"
            )}
          </span>
        </div>

        {isPro && (
          <div className="mt-4 space-y-2.5 rounded-xl bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 p-3.5">
            {purchaseDate && (
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#6B6B6B] dark:text-[#9B9B9B]">Active since</span>
                <span className="text-[11px] font-medium text-[#1A1A1A] dark:text-[#C8C8C8]">{purchaseDate}</span>
              </div>
            )}
            {expirationDate && (
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#6B6B6B] dark:text-[#9B9B9B]">Renews</span>
                <span className="text-[11px] font-medium text-[#1A1A1A] dark:text-[#C8C8C8]">{expirationDate}</span>
              </div>
            )}
            {activeEntitlements.length > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#6B6B6B] dark:text-[#9B9B9B]">Entitlements</span>
                <span className="text-[11px] font-medium text-[#1A1A1A] dark:text-[#C8C8C8]">{activeEntitlements.join(", ")}</span>
              </div>
            )}
          </div>
        )}

        {!isPro && (
          <div className="mt-4">
            <p className="text-[12px] text-[#6B6B6B] dark:text-[#9B9B9B] mb-3">
              Upgrade to Pro to unlock unlimited SEO campaigns, all platform support, and AI-powered optimization.
            </p>
            <motion.button
              onClick={onUpgrade}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2563EB] to-[#6A3093] px-5 py-2.5 text-[12px] font-semibold text-white shadow-sm transition-all hover:shadow-md"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Upgrade to Pro
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Restore Purchases */}
      <motion.div
        className="rounded-2xl border border-[#E8E5E0] dark:border-[#2A2A2E] bg-white dark:bg-[#1E1E22] p-5 shadow-sm"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="font-heading text-sm font-bold text-[#1A1A1A] dark:text-white">Restore Purchases</h3>
        <p className="mt-1 text-[11px] text-[#6B6B6B] dark:text-[#9B9B9B]">
          If you previously purchased a subscription, restore it to this device.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <motion.button
            onClick={handleRestore}
            disabled={restoring || isLoading}
            className="inline-flex items-center gap-2 rounded-full border border-[#E8E5E0] dark:border-[#2A2A2E] bg-white dark:bg-[#252528] px-4 py-2 text-[11px] font-medium text-[#1A1A1A] dark:text-[#C8C8C8] transition-all hover:border-[#9B9B9B] dark:hover:border-[#444] disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {restoring ? (
              <motion.div
                className="h-3.5 w-3.5 rounded-full border-2 border-[#E8E5E0] dark:border-[#333] border-t-[#2563EB]"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
            )}
            Restore Purchases
          </motion.button>

          <AnimatePresence>
            {restoreMsg && (
              <motion.span
                className={`text-[11px] ${restoreMsg.includes("success") ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
              >
                {restoreMsg}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Error display */}
      {error && (
        <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-3">
          <p className="text-[11px] text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
