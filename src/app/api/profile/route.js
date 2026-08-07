import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { strapiFetch } from "../../../lib/strapi";

// This route reads the signed-in user via auth() (cookies/headers), so it
// can never be statically rendered — force Next.js to treat it as dynamic.
export const dynamic = "force-dynamic";

// Strapi is the source of truth for profile data (phone/university/bio/role).
// This route is the ONLY place that talks to the `profile` content-type,
// and it always derives the Clerk user id from the server-side session —
// never from the request body — so nobody can read/edit someone else's
// profile or grant themselves admin.

function flattenProfile(entry) {
  if (!entry) return null;
  const attrs = entry.attributes || entry;
  return {
    id: String(entry.documentId || entry.id),
    clerkId: attrs.clerkId,
    fullName: attrs.fullName || "",
    email: attrs.email || "",
    phone: attrs.phone || "",
    university: attrs.university || "",
    bio: attrs.bio || "",
    avatarUrl: attrs.avatarUrl || "",
    role: attrs.role || "user",
  };
}

async function findProfileByClerkId(clerkId) {
  const query = new URLSearchParams();
  query.set("filters[clerkId][$eq]", clerkId);
  query.set("pagination[pageSize]", "1");
  const data = await strapiFetch(`/profiles?${query.toString()}`);
  return data.data?.[0] || null;
}

// GET /api/profile — returns the current user's profile, creating one
// (seeded from Clerk) the first time it's requested. This is what makes
// Google sign-ins automatically get a Strapi profile with no extra step.
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }

    let raw = await findProfileByClerkId(userId);

    if (!raw) {
      const user = await currentUser();
      const created = await strapiFetch("/profiles", {
        method: "POST",
        body: JSON.stringify({
          data: {
            clerkId: userId,
            fullName: user?.fullName || user?.firstName || "Student",
            email: user?.primaryEmailAddress?.emailAddress || "",
            // One-time seed: phone collected at registration lives in Clerk's
            // unsafeMetadata just long enough to get copied in here. After
            // this, phone only ever lives in Strapi (edited via PUT below).
            phone: user?.unsafeMetadata?.phone || "",
            avatarUrl: user?.imageUrl || "",
            role: "user",
          },
        }),
      });
      raw = created.data;
    }

    return NextResponse.json({ profile: flattenProfile(raw) });
  } catch (err) {
    console.error("GET /api/profile failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT /api/profile — update the current user's own profile.
// Role is intentionally never accepted here — it can't be self-granted.
export async function PUT(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, phone, university, bio, avatarUrl } = body;

    let raw = await findProfileByClerkId(userId);
    if (!raw) {
      // Shouldn't normally happen (GET creates it first), but handle it
      // defensively so PUT never fails just because GET wasn't called yet.
      const user = await currentUser();
      const created = await strapiFetch("/profiles", {
        method: "POST",
        body: JSON.stringify({
          data: {
            clerkId: userId,
            email: user?.primaryEmailAddress?.emailAddress || "",
            role: "user",
          },
        }),
      });
      raw = created.data;
    }

    const documentId = raw.documentId || raw.id;
    console.log("PUT /api/profile — updating Strapi record:", {
      clerkId: userId,
      rawFromStrapi: raw,
      documentIdUsed: documentId,
      urlBeingCalled: `/profiles/${documentId}`,
    });

    let updated;
    try {
      updated = await strapiFetch(`/profiles/${documentId}`, {
        method: "PUT",
        body: JSON.stringify({
          data: {
            ...(fullName !== undefined ? { fullName } : {}),
            ...(phone !== undefined ? { phone } : {}),
            ...(university !== undefined ? { university } : {}),
            ...(bio !== undefined ? { bio } : {}),
            ...(avatarUrl !== undefined ? { avatarUrl } : {}),
          },
        }),
      });
    } catch (strapiErr) {
      console.error("Strapi rejected the update:", {
        message: strapiErr.message,
        documentIdTried: documentId,
        rawRecord: raw,
      });
      throw strapiErr;
    }

    return NextResponse.json({ profile: flattenProfile(updated.data) });
  } catch (err) {
    console.error("PUT /api/profile failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}