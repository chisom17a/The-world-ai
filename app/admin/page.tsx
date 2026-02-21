"use client";

import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, limit, orderBy } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Users, CreditCard, Activity, ShieldCheck } from "lucide-react";

export default function AdminDashboard() {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && (!profile || profile.role !== "admin")) {
      router.push("/dashboard");
    }
  }, [profile, loading, router]);

  useEffect(() => {
    const fetchStats = async () => {
      const statsSnap = await getDocs(collection(db, "adminStats"));
      if (!statsSnap.empty) setStats(statsSnap.docs[0].data());

      const paymentsSnap = await getDocs(query(collection(db, "payments"), orderBy("createdAt", "desc"), limit(5)));
      setRecentPayments(paymentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    if (profile?.role === "admin") fetchStats();
  }, [profile]);

  if (loading || !profile || profile.role !== "admin") return <div>Unauthorized</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-blue-600" /> Admin Dashboard
            </h1>
            <p className="text-gray-500">Overview of Chibot&apos;s performance and operations.</p>
          </div>
          <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{stats?.totalRevenue || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Subs</CardTitle>
              <Users className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeSubscribers || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Builds</CardTitle>
              <Activity className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalBuilds || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
              <CreditCard className="w-4 h-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.failedPayments || 0}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPayments.map(payment => (
                  <div key={payment.id} className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-lg">
                    <div>
                      <p className="text-sm font-bold">{payment.email}</p>
                      <p className="text-xs text-gray-500">{new Date(payment.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">₦{payment.amount}</p>
                      <p className={`text-[10px] uppercase font-bold ${payment.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>{payment.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" variant="outline">Create Promo Coupon</Button>
              <Button className="w-full justify-start" variant="outline">Manage Users</Button>
              <Button className="w-full justify-start" variant="outline">View System Logs</Button>
              <Button className="w-full justify-start" variant="outline">Export Revenue Data</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
