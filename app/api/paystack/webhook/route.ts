import { adminDb } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    if (!signature) return NextResponse.json({ error: "No signature" }, { status: 400 });

    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.event === "charge.success") {
      const { reference, metadata } = event.data;
      const { userId, plan } = metadata;

      const batch = adminDb.batch();

      // 1. Update payment status
      batch.update(adminDb.collection("payments").doc(reference), {
        status: "success",
        paidAt: new Date().toISOString(),
      });

      // 2. Update user plan
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 30);

      batch.update(adminDb.collection("users").doc(userId), {
        plan: "pro",
        subscriptionStatus: "active",
        subscriptionExpiry: expiry.toISOString(),
        "limits.dailyBuildLimit": 9999,
        "limits.monthlyTokenLimit": 1000000,
      });

      // 3. Update admin stats
      const statsRef = adminDb.collection("adminStats").doc("global");
      batch.set(statsRef, {
        totalRevenue: adminDb.firestore.FieldValue.increment(event.data.amount / 100),
        activeSubscribers: adminDb.firestore.FieldValue.increment(1),
      }, { merge: true });

      // 4. Handle referral commission
      const userSnap = await adminDb.collection("users").doc(userId).get();
      const userData = userSnap.data();
      if (userData?.referredBy) {
        const referrers = await adminDb.collection("users").where("referralCode", "==", userData.referredBy).get();
        if (!referrers.empty) {
          const referrerDoc = referrers.docs[0];
          const commission = (event.data.amount / 100) * 0.1; // 10% commission
          batch.update(referrerDoc.ref, {
            referralEarnings: adminDb.firestore.FieldValue.increment(commission),
          });
          
          batch.set(adminDb.collection("referrals").doc(), {
            referrerId: referrerDoc.id,
            referredUserId: userId,
            commissionAmount: commission,
            status: "paid",
            createdAt: new Date().toISOString(),
          });
        }
      }

      await batch.commit();
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Paystack Webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
