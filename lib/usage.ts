import { db } from "./firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { User } from "./types";

export async function checkUsageLimit(userId: string): Promise<{ allowed: boolean; reason?: string }> {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return { allowed: false, reason: "User not found" };

  const userData = userSnap.data() as User;
  const today = new Date().toISOString().split("T")[0];

  // Reset daily builds if it's a new day
  if (userData.usage.lastBuildDate !== today) {
    await updateDoc(userRef, {
      "usage.dailyBuilds": 0,
      "usage.lastBuildDate": today,
    });
    userData.usage.dailyBuilds = 0;
  }

  // Check subscription expiry
  if (userData.plan === "pro" && userData.subscriptionExpiry) {
    if (new Date(userData.subscriptionExpiry) < new Date()) {
      await updateDoc(userRef, {
        plan: "free",
        subscriptionStatus: "expired",
        "limits.dailyBuildLimit": 5,
        "limits.monthlyTokenLimit": 50000,
      });
      return { allowed: false, reason: "Subscription expired. Downgraded to free plan." };
    }
  }

  if (userData.plan === "free" && userData.usage.dailyBuilds >= userData.limits.dailyBuildLimit) {
    return { allowed: false, reason: "Daily build limit reached for free plan. Please upgrade to Pro." };
  }

  return { allowed: true };
}

export async function incrementUsage(userId: string, tokens: number = 0) {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    "usage.dailyBuilds": increment(1),
    "usage.monthlyBuilds": increment(1),
    "usage.monthlyTokens": increment(tokens),
  });
}
