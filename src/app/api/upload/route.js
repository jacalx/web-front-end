import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// This route reads the signed-in user via auth() (cookies/headers), so it
// can never be statically rendered — force Next.js to treat it as dynamic.
export const dynamic = "force-dynamic";

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

// POST /api/upload — accepts multipart form data ("files" field, can repeat),
// forwards to Strapi's built-in /api/upload, and returns the public URLs.
// Only signed-in users can upload (stops randoms from filling your Strapi
// media library).
export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }

    const incomingForm = await request.formData();
    const forwardForm = new FormData();
    for (const file of incomingForm.getAll("files")) {
      forwardForm.append("files", file);
    }

    const res = await fetch(`${STRAPI_URL}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
      body: forwardForm,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error?.message || "Upload failed");
    }

    // Strapi returns absolute or relative URLs depending on your storage
    // provider — normalize relative ones so <img src> works from the browser.
    const urls = data.map((f) => (f.url.startsWith("http") ? f.url : `${STRAPI_URL}${f.url}`));

    return NextResponse.json({ urls });
  } catch (err) {
    console.error("POST /api/upload failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}