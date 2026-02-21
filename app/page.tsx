"use client";

import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Zap, Rocket, Shield, ArrowRight, Github, Check, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-xl shadow-slate-200">C</div>
            <span className="text-xl font-bold tracking-tighter">Chibot</span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-[13px] font-bold uppercase tracking-widest text-slate-500">
            <Link href="#features" className="hover:text-slate-900 transition-colors">Features</Link>
            <Link href="/pricing" className="hover:text-slate-900 transition-colors">Pricing</Link>
            <Link href="/login" className="hover:text-slate-900 transition-colors">Login</Link>
            <Button asChild className="bg-slate-900 hover:bg-slate-800 rounded-full px-6 h-10 text-xs font-bold uppercase tracking-widest">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-8 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-8">
              <Zap className="w-3 h-3" /> Now in Public Beta
            </div>
            <h1 className="text-7xl md:text-[120px] font-bold tracking-tighter leading-[0.85] mb-10 text-slate-900">
              CODE AT THE <br />
              <span className="text-blue-600">SPEED OF THOUGHT.</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
              The first AI-native development platform that handles the entire lifecycle. 
              From architectural planning to production deployment.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <Button size="lg" className="h-16 px-10 text-sm font-bold uppercase tracking-widest gap-3 rounded-full bg-slate-900 hover:bg-slate-800 shadow-2xl shadow-slate-200" asChild>
                <Link href="/signup">Start Building <ArrowRight className="w-4 h-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-10 text-sm font-bold uppercase tracking-widest gap-3 rounded-full border-slate-200 hover:bg-slate-50">
                <Github className="w-5 h-5" /> Star on GitHub
              </Button>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-24 relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-[32px] blur-2xl opacity-20" />
            <div className="relative rounded-[32px] border border-slate-200 shadow-2xl overflow-hidden bg-white p-4">
              <div className="rounded-2xl overflow-hidden border border-slate-100">
                <img src="https://picsum.photos/1600/900?grayscale" alt="Chibot Interface" className="w-full object-cover" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center mb-32">
            <div>
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl shadow-blue-200">
                <Code className="w-6 h-6" />
              </div>
              <h2 className="text-5xl font-bold tracking-tight mb-6 text-slate-900">AI-Native <br /> Architecture.</h2>
              <p className="text-lg text-slate-500 leading-relaxed mb-8">
                Unlike simple code completion, Chibot understands the big picture. 
                It plans your database schema, chooses the right tech stack, and 
                organizes your file structure before writing a single line of code.
              </p>
              <ul className="space-y-4">
                {['Full-stack generation', 'Database schema planning', 'Modular file structure'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <Check className="w-3 h-3" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square bg-white rounded-[40px] shadow-2xl border border-slate-100 p-8 flex flex-col justify-center">
                <div className="space-y-6">
                  <div className="h-4 w-3/4 bg-slate-100 rounded-full animate-pulse" />
                  <div className="h-4 w-1/2 bg-slate-100 rounded-full animate-pulse" />
                  <div className="h-4 w-5/6 bg-slate-100 rounded-full animate-pulse" />
                  <div className="h-32 w-full bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-blue-500 animate-bounce" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Failover Engine', desc: '5-key failover system ensures 99.9% uptime for AI generation.', icon: Shield },
              { title: 'Instant Deploy', desc: 'One-click deployment to Vercel with automatic configuration.', icon: Rocket },
              { title: 'Referral Rewards', desc: 'Earn 10% commission for every friend you bring to the platform.', icon: Users },
            ].map((feature) => (
              <Card key={feature.title} className="p-8 border-none shadow-none bg-white rounded-[32px]">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-900 mb-6">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-8">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[48px] p-12 md:p-24 text-center relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-8">
              Ready to build the future?
            </h2>
            <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto">
              Join thousands of developers building faster with Chibot. 
              Start your first project in less than 60 seconds.
            </p>
            <Button size="lg" className="h-16 px-12 text-sm font-bold uppercase tracking-widest rounded-full bg-white text-slate-900 hover:bg-slate-100" asChild>
              <Link href="/signup">Get Started for Free</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">C</div>
                <span className="text-xl font-bold tracking-tighter">Chibot</span>
              </div>
              <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                The AI-native development platform for modern engineering teams.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Product</h4>
                <ul className="space-y-2 text-sm font-medium text-slate-600">
                  <li><Link href="#features">Features</Link></li>
                  <li><Link href="/pricing">Pricing</Link></li>
                  <li><Link href="/login">Login</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Company</h4>
                <ul className="space-y-2 text-sm font-medium text-slate-600">
                  <li><Link href="#">About</Link></li>
                  <li><Link href="#">Blog</Link></li>
                  <li><Link href="#">Careers</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Legal</h4>
                <ul className="space-y-2 text-sm font-medium text-slate-600">
                  <li><Link href="#">Privacy</Link></li>
                  <li><Link href="#">Terms</Link></li>
                  <li><Link href="#">Security</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-slate-50 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            <p>© 2024 Chibot Inc. All rights reserved.</p>
            <div className="flex gap-8">
              <Link href="#" className="hover:text-slate-900 transition-colors">Twitter</Link>
              <Link href="#" className="hover:text-slate-900 transition-colors">GitHub</Link>
              <Link href="#" className="hover:text-slate-900 transition-colors">Discord</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
