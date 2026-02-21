"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Users, Gift, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ReferralsPage() {
  const { profile } = useAuth();
  const { toast } = useToast();

  const referralLink = `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/signup?ref=${profile?.referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast({ title: "Link Copied", description: "Share it with your friends!" });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Referral Program</h1>
        <p className="text-gray-500 mb-10">Invite your friends and earn 10% commission on their first upgrade.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
              <Users className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.referralCount || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <TrendingUp className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{profile?.referralEarnings || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
              <Gift className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">10%</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-10">
          <CardHeader>
            <CardTitle>Your Referral Link</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="flex-1 bg-gray-100 p-3 rounded-lg text-sm font-mono truncate">
                {referralLink}
              </div>
              <Button onClick={copyToClipboard} className="gap-2">
                <Copy className="w-4 h-4" /> Copy
              </Button>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-xl font-bold mb-6">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">1</div>
            <h3 className="font-bold">Share your link</h3>
            <p className="text-sm text-gray-500">Send your unique referral link to friends, colleagues, or on social media.</p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">2</div>
            <h3 className="font-bold">They sign up</h3>
            <p className="text-sm text-gray-500">When they create an account using your link, they are automatically tracked as your referral.</p>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">3</div>
            <h3 className="font-bold">Earn rewards</h3>
            <p className="text-sm text-gray-500">When they upgrade to a Pro plan, you receive a 10% commission instantly.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
