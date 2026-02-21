import { initializePayment } from "@/lib/paystack";
import { adminDb } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, email, plan, couponCode } = await req.json();

    let amount = plan === "pro" ? 1000 : 0;
    let discount = 0;

    if (couponCode) {
      const couponSnap = await adminDb.collection("coupons").where("code", "==", couponCode).where("active", "==", true).get();
      if (!couponSnap.empty) {
        const coupon = couponSnap.docs[0].data();
        if (new Date(coupon.expiresAt) > new Date() && coupon.usedCount < coupon.maxUses) {
          discount = (amount * coupon.discountPercent) / 100;
          amount -= discount;
          
          // Increment usedCount
          await couponSnap.docs[0].ref.update({
            usedCount: adminDb.firestore.FieldValue.increment(1)
          });
        }
      }
    }

    const reference = `CHIBOT-${Math.random().toString(36).substring(2, 15).toUpperCase()}`;

    const paymentData = {
      userId,
      email,
      amount,
      plan,
      reference,
      status: "initialized",
      createdAt: new Date().toISOString(),
    };

    await adminDb.collection("payments").doc(reference).set(paymentData);

    const paystackResponse = await initializePayment(email, amount, { userId, plan, reference });

    if (paystackResponse.status) {
      return NextResponse.json(paystackResponse.data);
    } else {
      throw new Error(paystackResponse.message);
    }
  } catch (error: any) {
    console.error("Paystack Init error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
