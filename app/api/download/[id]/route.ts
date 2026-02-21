import { adminDb } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";
import JSZip from "jszip";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id;
    const filesSnap = await adminDb.collection("projects").doc(projectId).collection("files").get();

    if (filesSnap.empty) {
      return NextResponse.json({ error: "No files found" }, { status: 404 });
    }

    const zip = new JSZip();
    filesSnap.docs.forEach(doc => {
      const data = doc.data();
      zip.file(data.path, data.content);
    });

    const content = await zip.generateAsync({ type: "nodebuffer" });

    return new NextResponse(content, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="project-${projectId}.zip"`,
      },
    });
  } catch (error: any) {
    console.error("Download API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
