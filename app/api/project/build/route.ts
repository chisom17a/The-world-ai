import { getAIResponse } from "@/lib/openai";
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { projectId, plan, userId } = await req.json();

    // 1. Check usage limit (server-side check)
    const userRef = adminDb.collection("users").doc(userId);
    const userSnap = await userRef.get();
    const userData = userSnap.data();

    if (!userData) throw new Error("User not found");

    if (userData.plan === "free" && userData.usage.dailyBuilds >= userData.limits.dailyBuildLimit) {
      return NextResponse.json({ error: "Daily build limit reached" }, { status: 403 });
    }

    const systemInstruction = `You are a senior full-stack developer.
    Based on the provided plan, generate the full source code for the application.
    Return ONLY a JSON object where keys are file paths and values are file contents.
    Example: { "package.json": "{...}", "app/page.tsx": "..." }
    Include all necessary configuration files.`;

    const userPrompt = `Plan: ${JSON.stringify(plan)}`;

    const response = await getAIResponse(userPrompt, systemInstruction);
    
    if (!response) throw new Error("No response from AI");

    const files = JSON.parse(response);

    // 2. Store files in Firestore
    const batch = adminDb.batch();
    const projectFilesRef = adminDb.collection("projects").doc(projectId).collection("files");

    Object.entries(files).forEach(([path, content]) => {
      const fileRef = projectFilesRef.doc();
      batch.set(fileRef, {
        filename: path.split("/").pop(),
        path,
        content,
        language: path.split(".").pop() || "text",
        size: (content as string).length,
        createdAt: new Date().toISOString(),
      });
    });

    // 3. Update usage
    batch.update(userRef, {
      "usage.dailyBuilds": adminDb.firestore.FieldValue.increment(1),
      "usage.monthlyBuilds": adminDb.firestore.FieldValue.increment(1),
    });

    // 4. Update project status
    batch.update(adminDb.collection("projects").doc(projectId), {
      status: "completed",
      updatedAt: new Date().toISOString(),
    });

    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Build API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
