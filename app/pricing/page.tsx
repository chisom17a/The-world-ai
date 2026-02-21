"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function PricingPage() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const [couponCode, setCouponCode] = useState("");

  const handleUpgrade = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/paystack/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          email: user.email,
          plan: "pro",
          couponCode
        }),
      });
      const data = await response.json();
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        throw new Error("Failed to initialize payment");
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 font-sans selection:bg-blue-500 selection:text-white">
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      
      <div className="text-center mb-20 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-6">
          Flexible Plans
        </div>
        <h1 className="text-6xl font-bold tracking-tighter text-slate-900 mb-6">Simple, Transparent <br /> Pricing.</h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">Choose the plan that&apos;s right for your development needs. No hidden fees, cancel anytime.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl w-full relative z-10">
        {/* Free Plan */}
        <Card className="flex flex-col p-8 border-slate-100 shadow-none bg-slate-50/50 rounded-[32px]">
          <CardHeader className="p-0 mb-8">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Starter</CardTitle>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-bold text-slate-900 tracking-tighter">₦0</span>
              <span className="text-sm text-slate-400 font-bold uppercase tracking-widest">/mo</span>
            </div>
            <p className="text-sm text-slate-500 mt-4">Perfect for hobbyists and students exploring AI-powered development.</p>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ul className="space-y-4">
              {[
                '5 Daily Builds',
                '50,000 Monthly Tokens',
                'Community Support',
                'Standard Generation Speed'
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-slate-400 border border-slate-100">
                    <Check className="w-3 h-3" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="p-0 mt-10">
            <Button variant="outline" className="w-full h-14 rounded-full border-slate-200 text-sm font-bold uppercase tracking-widest hover:bg-white" disabled={profile?.plan === 'free'} onClick={() => router.push("/dashboard")}>
              {profile?.plan === 'free' ? 'Current Plan' : 'Downgrade'}
            </Button>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="flex flex-col p-8 border-slate-900 bg-slate-900 text-white rounded-[32px] relative overflow-hidden shadow-2xl shadow-slate-200">
          <div className="absolute top-0 right-0 bg-blue-600 text-[10px] font-bold px-6 py-2 rounded-bl-2xl uppercase tracking-widest">Most Popular</div>
          <CardHeader className="p-0 mb-8">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Professional</CardTitle>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-bold text-white tracking-tighter">₦1,000</span>
              <span className="text-sm text-slate-500 font-bold uppercase tracking-widest">/mo</span>
            </div>
            <p className="text-sm text-slate-400 mt-4">For serious developers and teams building production-ready apps.</p>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ul className="space-y-4 mb-10">
              {[
                'Unlimited Daily Builds',
                '1,000,000 Monthly Tokens',
                'Priority Support',
                'Custom Deployments',
                'Early Access Features'
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm font-bold text-slate-100">
                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <Check className="w-3 h-3" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
            <div className="space-y-3 p-6 bg-slate-800/50 rounded-2xl border border-slate-800">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Have a coupon?</label>
              <Input 
                placeholder="Enter code" 
                value={couponCode} 
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="bg-slate-950 border-slate-700 h-10 text-xs font-bold tracking-widest placeholder:text-slate-700"
              />
            </div>
          </CardContent>
          <CardFooter className="p-0 mt-10">
            <Button className="w-full h-16 rounded-full bg-blue-600 hover:bg-blue-500 text-sm font-bold uppercase tracking-widest shadow-xl shadow-blue-900/20" onClick={handleUpgrade} disabled={loading || profile?.plan === 'pro'}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {profile?.plan === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
