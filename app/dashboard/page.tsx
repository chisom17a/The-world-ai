"use client";

import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, onSnapshot, addDoc } from "firebase/firestore";
import { Project } from "@/lib/types";
import { Plus, Layout, Zap, Users, LogOut, ExternalLink, Trash2, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { signOut } from "firebase/auth";

export default function DashboardPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, "projects"), where("userId", "==", user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const projs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
        setProjects(projs);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleCreateProject = async () => {
    if (!newProjectName) return;
    setIsCreating(true);
    try {
      const docRef = await addDoc(collection(db, "projects"), {
        userId: user?.uid,
        name: newProjectName,
        description: newProjectDesc,
        status: "planning",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      toast({ title: "Project Created", description: "Let's start planning!" });
      router.push(`/project/${docRef.id}`);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setIsCreating(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loading || !profile) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col z-20">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-slate-200">C</div>
          <span className="text-xl font-bold tracking-tight">Chibot</span>
        </div>
        
        <nav className="flex-1 space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-3 bg-slate-100 text-slate-900 font-medium">
            <Layout className="w-4 h-4" /> Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all" onClick={() => router.push("/referrals")}>
            <Users className="w-4 h-4" /> Referrals
          </Button>
          {profile.role === "admin" && (
            <Button variant="ghost" className="w-full justify-start gap-3 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all" onClick={() => router.push("/admin")}>
              <Zap className="w-4 h-4" /> Admin
            </Button>
          )}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">Current Plan</p>
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold capitalize text-slate-900">{profile.plan} Plan</p>
              {profile.plan === "free" && (
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              )}
            </div>
            {profile.plan === "free" && (
              <Button size="sm" className="w-full mt-3 bg-slate-900 hover:bg-slate-800 text-xs" onClick={() => router.push("/pricing")}>Upgrade to Pro</Button>
            )}
          </div>
          <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 transition-all" onClick={handleLogout}>
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
        
        <header className="sticky top-0 z-10 bg-slate-50/80 backdrop-blur-md border-b border-slate-200 px-10 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back, {user?.email?.split("@")[0]}</h1>
            <p className="text-sm text-slate-500">You have {projects.length} active projects in your workspace.</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg shadow-slate-200 bg-slate-900 hover:bg-slate-800">
                <Plus className="w-4 h-4" /> New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Create New Project</DialogTitle>
                <p className="text-sm text-slate-500">Define your project goals and Chibot will handle the rest.</p>
              </DialogHeader>
              <div className="space-y-6 py-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Project Name</label>
                  <Input placeholder="E.g. E-commerce Platform" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} className="h-11" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</label>
                  <Input placeholder="What are you building? (e.g. A marketplace for digital art)" value={newProjectDesc} onChange={(e) => setNewProjectDesc(e.target.value)} className="h-11" />
                </div>
                <Button className="w-full h-11 bg-slate-900 hover:bg-slate-800" onClick={handleCreateProject} disabled={isCreating}>
                  {isCreating ? "Initializing..." : "Create Project"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        <div className="flex-1 p-10 space-y-10 relative">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">Daily Builds</CardTitle>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Layout className="w-4 h-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{profile.usage.dailyBuilds} <span className="text-sm text-slate-400 font-normal">/ {profile.limits.dailyBuildLimit}</span></div>
                <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-500" 
                    style={{ width: `${(profile.usage.dailyBuilds / profile.limits.dailyBuildLimit) * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">Token Usage</CardTitle>
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Zap className="w-4 h-4 text-amber-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{profile.usage.monthlyTokens.toLocaleString()}</div>
                <p className="text-xs text-slate-400 mt-2">Monthly Limit: {profile.limits.monthlyTokenLimit.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">Referral Earnings</CardTitle>
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <Users className="w-4 h-4 text-emerald-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">₦{profile.referralEarnings.toLocaleString()}</div>
                <p className="text-xs text-slate-400 mt-2">{profile.referralCount} successful invites</p>
              </CardContent>
            </Card>
          </div>

          {/* Projects Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Your Projects</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 text-xs">All</Button>
                <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-500">Recent</Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.length === 0 ? (
                <div className="col-span-full py-24 text-center bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">No projects yet</h3>
                  <p className="text-slate-500 max-w-xs mx-auto mt-2">Create your first project to start building with AI.</p>
                  <Button className="mt-6 bg-slate-900" onClick={() => document.getElementById('new-project-trigger')?.click()}>
                    Create Project
                  </Button>
                </div>
              ) : (
                projects.map((project) => (
                  <Card 
                    key={project.id} 
                    className="group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 cursor-pointer border-none bg-white overflow-hidden" 
                    onClick={() => router.push(`/project/${project.id}`)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-slate-900 group-hover:text-white transition-colors">
                          <Layout className="w-5 h-5" />
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${
                          project.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{project.name}</CardTitle>
                      <CardDescription className="line-clamp-2 text-slate-500 mt-1">{project.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between border-t border-slate-50 pt-4 bg-slate-50/30">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{new Date(project.createdAt).toLocaleDateString()}</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-white">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-red-50 hover:text-red-500">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
