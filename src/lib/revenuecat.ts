/**
 * RevenueCat SDK Integration for RankMeBaddy
 * Manages subscriptions using @revenuecat/purchases-js
 */

import { Purchases } from "@revenuecat/purchases-js";

const API_KEY = "test_tlRhcFQHyhurDBzpzNtNEEgOApR";
const ENTITLEMENT_NAME = "rankmebaddy Pro";

let isInitialized = false;

function getOrCreateUserID(): string {
  if (typeof window === "undefined") return "server";
  try {
    let id = localStorage.getItem("rankmebaddy_user_id");
    if (!id) {
      id = `rmb_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem("rankmebaddy_user_id", id);
    }
    return id;
  } catch {
    return `rmb_${Date.now()}_fallback`;
  }
}

export async function initializePurchases(): Promise<void> {
  if (isInitialized) return;
  if (typeof window === "undefined") return;

  try {
    const appUserID = getOrCreateUserID();
    Purchases.configure({ apiKey: API_KEY, appUserID });
    isInitialized = true;
  } catch (error) {
    console.error("[RevenueCat] Failed to initialize:", error);
    throw error;
  }
}

export async function getOfferings() {
  try {
    if (!isInitialized) await initializePurchases();
    const offerings = await Purchases.getOfferings();
    return offerings;
  } catch (error: unknown) {
    const rcError = error as { errorCode?: number; message?: string };
    console.error("[RevenueCat] getOfferings error:", rcError.errorCode, rcError.message);
    throw error;
  }
}

export async function purchasePackage(packageToPurchase: Parameters<typeof Purchases.purchasePackage>[0]) {
  try {
    if (!isInitialized) await initializePurchases();
    const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
    return customerInfo;
  } catch (error: unknown) {
    const rcError = error as { errorCode?: number; message?: string; code?: string };
    // RevenueCat error codes
    if (rcError.errorCode === 1) {
      console.log("[RevenueCat] Purchase cancelled by user");
    } else {
      console.error("[RevenueCat] purchasePackage error:", rcError.errorCode, rcError.message);
    }
    throw error;
  }
}

export async function getCustomerInfo() {
  try {
    if (!isInitialized) await initializePurchases();
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo;
  } catch (error: unknown) {
    const rcError = error as { errorCode?: number; message?: string };
    console.error("[RevenueCat] getCustomerInfo error:", rcError.errorCode, rcError.message);
    throw error;
  }
}

export function checkEntitlement(customerInfo: {
  entitlements: { active: Record<string, unknown>; all: Record<string, unknown> };
}): boolean {
  if (!customerInfo?.entitlements?.active) return false;
  return ENTITLEMENT_NAME in customerInfo.entitlements.active;
}

export async function restorePurchases() {
  try {
    if (!isInitialized) await initializePurchases();
    // The Web SDK uses getCustomerInfo for restore
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo;
  } catch (error: unknown) {
    const rcError = error as { errorCode?: number; message?: string };
    console.error("[RevenueCat] restorePurchases error:", rcError.errorCode, rcError.message);
    throw error;
  }
}
