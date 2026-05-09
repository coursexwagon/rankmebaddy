"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSubscription } from "@/hooks/use-subscription";
import {
  getOfferings,
  purchasePackage,
} from "@/lib/revenuecat";

/* ─── Types ──────────────────────────────────────────────────── */
interface PaywallProps {
  open: boolean;
  onClose: () => void;
}

interface ProductDisplay {
  identifier: string;
  title: string;
  price: string;
  period: string;
  description: string;
  popular?: boolean;
  pkg: unknown;
}

const PRO_FEATURES = [
  { icon: "🎯", text: "Unlimited SEO campaigns across all platforms" },
  { icon: "🔍", text: "Real-time keyword tracking & gap analysis" },
  { icon: "✍️", text: "AI content optimization & generation" },
  { icon: "📊", text: "Advanced ranking analytics & reports" },
  { icon: "🌐", text: "Google, YouTube, Amazon, TikTok, AI Search" },
  { icon: "⚡", text: "Priority support & early feature access" },
];

/* ─── Paywall Component ──────────────────────────────────────── */
export function Paywall({ open, onClose }: PaywallProps) {
  const { isPro, isLoading: subLoading, purchaseProduct, refreshCustomerInfo } = useSubscription();
  const [products, setProducts] = useState<ProductDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!open) return;
    loadOfferings();
  }, [open]);

  const loadOfferings = async () => {
    setLoading(true);
    setError(null);
    try {
      const offerings = await getOfferings();
      const current = offerings?.current;
      if (current?.availablePackages) {
        const mapped: ProductDisplay[] = current.availablePackages.map((pkg: any) => {
          const product = pkg.product;
          const id = pkg.identifier || product?.identifier || "";
          let title = "Pro";
          let period = "";
          let popular = false;

          if (id.includes("lifetime") || id.includes("lifetime")) {
            title = "Lifetime";
            period = "forever";
          } else if (id.includes("yearly") || id.includes("annual")) {
            title = "Yearly";
            period = "/year";
            popular = true;
          } else if (id.includes("monthly") || id.includes("month")) {
            title = "Monthly";
            period = "/month";
          }

          return {
            identifier: id,
            title,
            price: product?.priceString || "$0",
            period,
            description: product?.description || `RankMeBaddy Pro — ${title}`,
            popular,
            pkg,
          };
        });

        // Sort: Lifetime first, Yearly second, Monthly third
        const sortOrder: Record<string, number> = { Lifetime: 0, Yearly: 1, Monthly: 2 };
        mapped.sort((a, b) => (sortOrder[a.title] ?? 3) - (sortOrder[b.title] ?? 3));

        setProducts(mapped);
      } else {
        // Fallback: show placeholder products when no offerings configured yet
        setProducts([
          {
            identifier: "lifetime",
            title: "Lifetime",
            price: "$299",
            period: "forever",
            description: "Pay once, rank forever",
            pkg: null,
          },
          {
            identifier: "yearly",
            title: "Yearly",
            price: "$49",
            period: "/year",
            description: "Best value for serious SEO",
            popular: true,
            pkg: null,
          },
          {
            identifier: "monthly",
            title: "Monthly",
            price: "$9",
            period: "/month",
            description: "Flexible monthly plan",
            pkg: null,
          },
        ]);
      }
    } catch {
      // Show fallback products on error
      setProducts([
        { identifier: "lifetime", title: "Lifetime", price: "$299", period: "forever", description: "Pay once, rank forever", pkg: null },
        { identifier: "yearly", title: "Yearly", price: "$49", period: "/year", description: "Best value for serious SEO", popular: true, pkg: null },
        { identifier: "monthly", title: "Monthly", price: "$9", period: "/month", description: "Flexible monthly plan", pkg: null },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (product: ProductDisplay) => {
    if (!product.pkg) {
      setError("Product not available yet. Please configure offerings in RevenueCat dashboard.");
      return;
    }
    setPurchasing(product.identifier);
    setError(null);
    try {
      await purchaseProduct(product.pkg);
      setSuccess(true);
      await refreshCustomerInfo();
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch {
      setError("Purchase failed. Please try again.");
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-[#E8E5E0] dark:border-[#2A2A2E] bg-white dark:bg-[#1A1A1E] shadow-2xl"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Success overlay */}
            <AnimatePresence>
              {success && (
                <motion.div
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white dark:bg-[#1A1A1E]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15, stiffness: 200 }}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </motion.div>
                  <h3 className="mt-4 font-heading text-xl font-bold text-[#1A1A1A] dark:text-white">Welcome to Pro!</h3>
                  <p className="mt-1 text-sm text-[#6B6B6B] dark:text-[#9B9B9B]">Your SEO ranking power just leveled up</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
            <div className="relative overflow-hidden px-6 pt-8 pb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/5 to-[#6A3093]/5 dark:from-[#2563EB]/10 dark:to-[#6A3093]/10" />
              <div className="relative">
                <button
                  onClick={onClose}
                  className="absolute -top-2 right-0 flex h-8 w-8 items-center justify-center rounded-full text-[#6B6B6B] dark:text-[#9B9B9B] transition-colors hover:bg-[#F5F5F0] dark:hover:bg-[#2A2A2E] hover:text-[#1A1A1A] dark:hover:text-white"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB] to-[#6A3093]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-heading text-lg font-bold text-[#1A1A1A] dark:text-white">
                      rankmebaddy Pro
                    </h2>
                    <p className="text-[11px] text-[#6B6B6B] dark:text-[#9B9B9B]">
                      Rank everywhere. Without limits.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="px-6 py-4">
              <div className="grid grid-cols-2 gap-2">
                {PRO_FEATURES.map((feature, i) => (
                  <motion.div
                    key={feature.text}
                    className="flex items-start gap-2 rounded-xl bg-[#FAFAF7] dark:bg-[#252528] px-3 py-2.5"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <span className="mt-0.5 text-sm">{feature.icon}</span>
                    <span className="text-[11px] leading-snug text-[#1A1A1A] dark:text-[#C8C8C8]">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="px-6 pb-2">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <motion.div
                    className="h-6 w-6 rounded-full border-2 border-[#E8E5E0] dark:border-[#2A2A2E] border-t-[#2563EB]"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              ) : (
                <div className="space-y-2.5">
                  {products.map((product, i) => (
                    <motion.button
                      key={product.identifier}
                      onClick={() => handlePurchase(product)}
                      disabled={purchasing !== null || subLoading}
                      className={`relative flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                        product.popular
                          ? "border-[#2563EB] dark:border-[#2563EB] bg-blue-50/50 dark:bg-[#2563EB]/10 shadow-sm"
                          : "border-[#E8E5E0] dark:border-[#2A2A2E] bg-white dark:bg-[#1E1E22] hover:border-[#9B9B9B] dark:hover:border-[#444]"
                      } ${purchasing === product.identifier ? "ring-2 ring-[#2563EB]/30" : ""} disabled:opacity-60`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.08 }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      {/* Popular badge */}
                      {product.popular && (
                        <span className="absolute -top-2.5 right-4 rounded-full bg-[#2563EB] px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                          Most Popular
                        </span>
                      )}

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5F5F0] dark:bg-[#2A2A2E]">
                        {product.title === "Lifetime" ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6A3093" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                        ) : product.title === "Yearly" ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                        )}
                      </div>

                      <div className="flex-1">
                        <p className="text-[13px] font-semibold text-[#1A1A1A] dark:text-white">{product.title}</p>
                        <p className="text-[10px] text-[#6B6B6B] dark:text-[#9B9B9B]">{product.description}</p>
                      </div>

                      <div className="text-right">
                        <p className="font-heading text-lg font-bold text-[#1A1A1A] dark:text-white">
                          {product.price}
                        </p>
                        <p className="text-[10px] text-[#9B9B9B]">{product.period}</p>
                      </div>

                      {/* Purchase spinner */}
                      {purchasing === product.identifier && (
                        <motion.div
                          className="absolute right-4 top-1/2 -translate-y-1/2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="mx-6 mb-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-2.5">
                <p className="text-[11px] text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-[#E8E5E0] dark:border-[#2A2A2E] px-6 py-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-[#9B9B9B]">Secure payment via RevenueCat</p>
                <button
                  onClick={onClose}
                  className="text-[11px] font-medium text-[#6B6B6B] dark:text-[#9B9B9B] transition-colors hover:text-[#1A1A1A] dark:hover:text-white"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
