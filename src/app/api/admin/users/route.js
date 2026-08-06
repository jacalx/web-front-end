import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { strapiFetch, isAdminUser } from "../../../../lib/strapi";

// GET /api/admin/users — admin only. Real data: Clerk is the source of
// truth for identity/ban status, Strapi is the source of truth for role.
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    if (!(await isAdminUser(userId))) {
      return NextResponse.json({ error: "403 Access Denied: Admin privileges required" }, { status: 403 });
    }

    const client = await clerkClient();
    const { data: clerkUsers } = await client.users.getUserList({ limit: 100 });

    // Bulk-fetch matching Strapi profiles (for role + university) in one call
    const ids = clerkUsers.map((u) => u.id);
    const query = new URLSearchParams();
    ids.forEach((id) => query.append("filters[clerkId][$in]", id));
    query.set("pagination[pageSize]", "100");

    let profileByClerkId = {};
    if (ids.length > 0) {
      const profilesRes = await strapiFetch(`/profiles?${query.toString()}`);
      for (const entry of profilesRes.data || []) {
        const attrs = entry.attributes || entry;
        profileByClerkId[attrs.clerkId] = attrs;
      }
    }

    const users = clerkUsers.map((u) => {
      const profile = profileByClerkId[u.id];
      return {
        id: u.id,
        name: profile?.fullName || u.fullName || u.firstName || "Student",
        email: u.emailAddresses?.[0]?.emailAddress || "",
        university: profile?.university || "",
        role: profile?.role || "user",
        banned: u.banned,
        avatar: u.imageUrl,
        joinedDate: u.createdAt ? new Date(u.createdAt).toISOString().slice(0, 10) : "",
      };
    });

    return NextResponse.json({ users });
  } catch (err) {
    console.error("GET /api/admin/users failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
