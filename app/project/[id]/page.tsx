"use client";

import { useAuth } from "@/components/auth-provider";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, onSnapshot, query } from "firebase/firestore";
import { Project, ProjectFile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Play, Code, Rocket, Download, FileCode, CheckCircle2, Loader2, Zap, Plus, Layout } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function ProjectPage() {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [project, setProject] = useState<Project | null>(null);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [plan, setPlan] = useState<any>(null);
  const [isPlanning, setIsPlanning] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [activeFile, setActiveFile] = useState<ProjectFile | null>(null);

  useEffect(() => {
    if (id) {
      const unsubProject = onSnapshot(doc(db, "projects", id as string), (doc) => {
        if (doc.exists()) setProject({ id: doc.id, ...doc.data() } as Project);
      });

      const q = query(collection(db, "projects", id as string, "files"));
      const unsubFiles = onSnapshot(q, (snapshot) => {
        const f = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProjectFile));
        setFiles(f);
        if (f.length > 0 && !activeFile) setActiveFile(f[0]);
      });

      return () => {
        unsubProject();
        unsubFiles();
      };
    }
  }, [id]);

  const handlePlan = async () => {
    setIsPlanning(true);
    try {
      const response = await fetch("/api/project/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: project?.name,
          description: project?.description,
          prompt: "Generate a full technical plan for this project."
        }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setPlan(data);
      toast({ title: "Plan Generated", description: "Review the plan before building." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Planning Failed", description: error.message });
    } finally {
      setIsPlanning(false);
    }
  };

  const handleBuild = async () => {
    if (!plan) return;
    setIsBuilding(true);
    try {
      const response = await fetch("/api/project/build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: id,
          plan,
          userId: user?.uid
        }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      toast({ title: "Build Successful", description: "Your code is ready!" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Build Failed", description: error.message });
    } finally {
      setIsBuilding(false);
    }
  };

  const handleDownload = async () => {
    router.push(`/api/download/${id}`);
  };

  if (!project) return <div className="flex items-center justify-center min-h-screen">Loading Project...</div>;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between z-30 shadow-2xl">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} className="text-slate-400 hover:text-white hover:bg-slate-800">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight">{project.name}</h1>
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${project.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'}`} />
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{project.status}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Phase Stepper */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${plan || project.status !== 'planning' ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white'}`}>
              {plan || project.status !== 'planning' ? <CheckCircle2 className="w-3 h-3" /> : '1'}
            </div>
            <span className={`text-[11px] font-bold uppercase tracking-wider ${plan || project.status !== 'planning' ? 'text-emerald-500' : 'text-blue-500'}`}>Planning</span>
          </div>
          <div className="w-8 h-px bg-slate-800" />
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${project.status === 'completed' ? 'bg-emerald-500 text-white' : project.status === 'building' ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-800 text-slate-500'}`}>
              {project.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> : '2'}
            </div>
            <span className={`text-[11px] font-bold uppercase tracking-wider ${project.status === 'completed' ? 'text-emerald-500' : project.status === 'building' ? 'text-blue-500' : 'text-slate-500'}`}>Building</span>
          </div>
          <div className="w-8 h-px bg-slate-800" />
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${project.status === 'completed' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
              3
            </div>
            <span className={`text-[11px] font-bold uppercase tracking-wider ${project.status === 'completed' ? 'text-emerald-500' : 'text-slate-500'}`}>Deploy</span>
          </div>
        </div>

        <div className="flex gap-3">
          {project.status === 'planning' && !plan && (
            <Button onClick={handlePlan} disabled={isPlanning} className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20 h-9 text-xs font-bold">
              {isPlanning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              Generate Plan
            </Button>
          )}
          {plan && project.status === 'planning' && (
            <Button onClick={handleBuild} disabled={isBuilding} className="gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-900/20 h-9 text-xs font-bold">
              {isBuilding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Code className="w-3.5 h-3.5" />}
              Build Project
            </Button>
          )}
          {project.status === 'completed' && (
            <>
              <Button variant="outline" onClick={handleDownload} className="gap-2 border-slate-700 text-slate-300 hover:bg-slate-800 h-9 text-xs font-bold">
                <Download className="w-3.5 h-3.5" /> Export ZIP
              </Button>
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20 h-9 text-xs font-bold">
                <Rocket className="w-3.5 h-3.5" /> Deploy to Vercel
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex overflow-hidden relative">
        {project.status === 'planning' ? (
          <div className="flex-1 flex flex-col items-center justify-center p-10 overflow-auto relative">
            <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />
            
            {!plan ? (
              <div className="max-w-xl w-full text-center space-y-8 z-10">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto border border-slate-800 shadow-2xl">
                    <Zap className="w-10 h-10 text-blue-500" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-slate-950">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight mb-4">Initialize Project Architecture</h2>
                  <p className="text-slate-400 text-lg leading-relaxed">Chibot will analyze your requirements and generate a comprehensive technical plan, including tech stack, file structure, and database schema.</p>
                </div>
                <div className="pt-4">
                  <Button size="lg" onClick={handlePlan} disabled={isPlanning} className="h-14 px-10 text-lg bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-900/20 gap-3">
                    {isPlanning ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6" />}
                    {isPlanning ? "Architecting..." : "Start Planning"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="max-w-5xl w-full space-y-8 z-10 py-10">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold text-white tracking-tight">Technical Blueprint</h2>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" onClick={() => setPlan(null)}>Reset Plan</Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-slate-900 border-slate-800 col-span-2">
                    <CardHeader className="border-b border-slate-800">
                      <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Layout className="w-4 h-4 text-blue-500" /> Architecture Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 tracking-wider">Tech Stack</h4>
                          <div className="flex flex-wrap gap-2">
                            {plan.tech_stack.map((item: string) => (
                              <span key={item} className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-[10px] font-bold border border-slate-700">{item}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 tracking-wider">Key Dependencies</h4>
                          <div className="flex flex-wrap gap-2">
                            {plan.dependencies.map((item: string) => (
                              <span key={item} className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-[10px] font-bold border border-slate-700">{item}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="pt-4">
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 tracking-wider">Database Schema</h4>
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-blue-400 overflow-auto max-h-48 code-scroll">
                          <pre>{plan.database_schema}</pre>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="border-b border-slate-800">
                      <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Ready to Build?
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                      <p className="text-sm text-slate-400 leading-relaxed">{plan.summary}</p>
                      <div className="pt-4">
                        <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-900/20 gap-2 font-bold" onClick={handleBuild} disabled={isBuilding}>
                          {isBuilding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Code className="w-4 h-4" />}
                          {isBuilding ? "Building Source..." : "Generate Source Code"}
                        </Button>
                        <p className="text-[10px] text-slate-500 text-center mt-3">This will consume 1 build credit from your daily limit.</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* File Explorer */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Explorer</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-slate-700" />
                  <div className="w-2 h-2 rounded-full bg-slate-700" />
                </div>
              </div>
              <div className="flex-1 overflow-auto p-2 code-scroll">
                {files.map(file => (
                  <button
                    key={file.id}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-3 mb-1 transition-all ${
                      activeFile?.id === file.id 
                        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-sm' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                    onClick={() => setActiveFile(file)}
                  >
                    <FileCode className={`w-4 h-4 ${activeFile?.id === file.id ? 'text-blue-400' : 'text-slate-500'}`} />
                    <span className="truncate">{file.path}</span>
                  </button>
                ))}
              </div>
            </aside>

            {/* Code Editor Preview */}
            <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden relative">
              {/* Editor Header */}
              <div className="px-6 py-2 border-b border-slate-900 bg-slate-900/50 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5 mr-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                    <FileCode className="w-3.5 h-3.5" /> {activeFile?.path}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold uppercase bg-slate-800 px-2 py-0.5 rounded text-slate-500 border border-slate-700">{activeFile?.language}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-white">
                    <Download className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {/* Editor Content */}
              <div className="flex-1 overflow-auto p-8 font-mono text-sm leading-relaxed code-scroll relative">
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-slate-900/20 border-r border-slate-900/50 flex flex-col items-center pt-8 text-[10px] text-slate-700 select-none">
                  {Array.from({ length: 50 }).map((_, i) => (
                    <div key={i} className="h-6 leading-relaxed">{i + 1}</div>
                  ))}
                </div>
                <pre className="pl-10 text-slate-300 whitespace-pre-wrap selection:bg-blue-500/40">
                  {activeFile?.content}
                </pre>
              </div>

              {/* Editor Footer */}
              <div className="px-6 py-1.5 border-t border-slate-900 bg-slate-900/30 flex justify-between items-center text-[10px] text-slate-500 font-medium">
                <div className="flex gap-4">
                  <span>UTF-8</span>
                  <span>Spaces: 2</span>
                </div>
                <div className="flex gap-4">
                  <span>Ln 1, Col 1</span>
                  <span className="text-blue-500 font-bold">Chibot Engine v1.0</span>
                </div>
              </div>
            </div>

            {/* Right Sidebar (Assistant) */}
            <aside className="hidden lg:flex w-72 bg-slate-900 border-l border-slate-800 flex-col">
              <div className="p-4 border-b border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">AI Assistant</span>
              </div>
              <div className="flex-1 p-6 space-y-6 overflow-auto code-scroll">
                <div className="p-4 bg-blue-600/5 border border-blue-500/20 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-blue-400">
                    <Zap className="w-4 h-4" />
                    <span className="text-xs font-bold">Build Complete</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">Chibot has successfully generated {files.length} files based on your technical blueprint.</p>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Next Steps</h4>
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start text-xs text-slate-400 hover:text-white hover:bg-slate-800 gap-2 h-8">
                      <Rocket className="w-3.5 h-3.5" /> Deploy to Staging
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-xs text-slate-400 hover:text-white hover:bg-slate-800 gap-2 h-8">
                      <Download className="w-3.5 h-3.5" /> Download Source
                    </Button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
