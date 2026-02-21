"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { motion } from "motion/react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const ref = searchParams.get("ref");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile in Firestore
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: result.user.uid,
          email: result.user.email,
          provider: "email",
          referredBy: ref,
        }),
      });

      if (!response.ok) throw new Error("Failed to create profile");

      toast({
        title: "Account Created",
        description: "Welcome to Chibot!",
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 font-sans selection:bg-blue-500 selection:text-white">
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full space-y-10 bg-white p-10 rounded-[40px] shadow-2xl shadow-slate-200 border border-slate-100 relative z-10"
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-6 shadow-xl shadow-slate-200">C</div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tighter">Create Account</h2>
          <p className="mt-3 text-slate-500 text-sm font-medium">Join thousands of developers building with Chibot.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSignup}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <Input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white transition-all"
              />
            </div>
            {ref && (
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-[10px] font-bold text-blue-600 uppercase tracking-widest text-center">
                Referral Applied: {ref}
              </div>
            )}
          </div>
          <Button type="submit" className="w-full h-14 rounded-full bg-slate-900 hover:bg-slate-800 text-sm font-bold uppercase tracking-widest shadow-xl shadow-slate-200" disabled={loading}>
            {loading ? "Creating Account..." : "Get Started"}
          </Button>
        </form>

        <p className="text-center text-[11px] font-bold uppercase tracking-widest text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-slate-900 hover:underline underline-offset-4">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
