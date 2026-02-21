import { adminDb } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";
import { User } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { uid, email, phone, provider, referredBy } = await req.json();

    const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const newUser: User = {
      uid,
      email,
      phone,
      provider: [provider],
      plan: "free",
      role: "user",
      usage: {
        dailyBuilds: 0,
        monthlyBuilds: 0,
        monthlyTokens: 0,
      },
      limits: {
        dailyBuildLimit: 5,
        monthlyTokenLimit: 50000,
      },
      subscriptionStatus: "inactive",
      referralCode,
      referredBy: referredBy || null,
      referralCount: 0,
      referralEarnings: 0,
      createdAt: new Date().toISOString(),
    };

    await adminDb.collection("users").doc(uid).set(newUser);

    // Handle referral logic
    if (referredBy) {
      const referrers = await adminDb.collection("users").where("referralCode", "==", referredBy).get();
      if (!referrers.empty) {
        const referrerDoc = referrers.docs[0];
        await referrerDoc.ref.update({
          referralCount: adminDb.firestore.FieldValue.increment(1),
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Signup API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
