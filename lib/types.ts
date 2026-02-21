export interface User {
  uid: string;
  email: string;
  phone?: string;
  provider: string[];
  plan: "free" | "pro";
  role: "user" | "admin";
  usage: {
    dailyBuilds: number;
    monthlyBuilds: number;
    monthlyTokens: number;
    lastBuildDate?: string;
  };
  limits: {
    dailyBuildLimit: number;
    monthlyTokenLimit: number;
  };
  subscriptionStatus: "active" | "inactive" | "expired";
  subscriptionExpiry?: string;
  referralCode: string;
  referredBy?: string;
  referralCount: number;
  referralEarnings: number;
  createdAt: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  techStack: any;
  fileStructure: any;
  status: "planning" | "building" | "completed";
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFile {
  id: string;
  projectId: string;
  filename: string;
  content: string;
  language: string;
  size: number;
  path: string;
}

export interface Deployment {
  id: string;
  projectId: string;
  userId: string;
  vercelUrl: string;
  status: "pending" | "success" | "failed";
  buildLogs: string[];
  createdAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: "initialized" | "success" | "failed" | "abandoned";
  reference: string;
  plan: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  active: boolean;
}
