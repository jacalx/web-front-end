import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { strapiFetch, isAdminUser } from "../../../../../lib/strapi";

// This route reads the signed-in user via auth() (cookies/headers), so it
// can never be statically rendered — force Next.js to treat it as dynamic.
export const dynamic = "force-dynamic";

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) return { ok: false, status: 401, message: "Sign in required" };
  if (!(await isAdminUser(userId))) {
    return { ok: false, status: 403, message: "403 Access Denied: Admin privileges required" };
  }
  return { ok: true, userId };
}

// PATCH /api/admin/users/[id] — body: { action: "ban" | "unban" }
export async function PATCH(request, { params }) {
  const check = await requireAdmin();
  if (!check.ok) return NextResponse.json({ error: check.message }, { status: check.status });

  if (params.id === check.userId) {
    return NextResponse.json({ error: "You can't ban your own account" }, { status: 400 });
  }

  try {
    const { action } = await request.json();
    const client = await clerkClient();

    if (action === "ban") {
      await client.users.banUser(params.id);
    } else if (action === "unban") {
      await client.users.unbanUser(params.id);
    } else {
      return NextResponse.json({ error: "action must be 'ban' or 'unban'" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`PATCH /api/admin/users/${params.id} failed:`, err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/admin/users/[id] — deletes the Clerk account and its Strapi profile
export async function DELETE(_request, { params }) {
  const check = await requireAdmin();
  if (!check.ok) return NextResponse.json({ error: check.message }, { status: check.status });

  if (params.id === check.userId) {
    return NextResponse.json({ error: "You can't delete your own account" }, { status: 400 });
  }

  try {
    const client = await clerkClient();
    await client.users.deleteUser(params.id);

    // Best-effort cleanup of the matching Strapi profile — a failure here
    // shouldn't block the deletion from the user's point of view, since
    // the account (the important part) is already gone.
    try {
      const query = new URLSearchParams();
      query.set("filters[clerkId][$eq]", params.id);
      query.set("pagination[pageSize]", "1");
      const found = await strapiFetch(`/profiles?${query.toString()}`);
      const raw = found.data?.[0];
      if (raw) {
        const documentId = raw.documentId || raw.id;
        await strapiFetch(`/profiles/${documentId}`, { method: "DELETE" });
      }
    } catch (cleanupErr) {
      console.error("Deleted Clerk user but failed to clean up Strapi profile:", cleanupErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`DELETE /api/admin/users/${params.id} failed:`, err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}