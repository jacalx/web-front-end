import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { strapiFetch } from "../../../lib/strapi";

// GET /api/stats — public. Only ever returns aggregate numbers, never
// individual user data, so it's safe to call from the logged-out homepage.
export async function GET() {
  try {
    const client = await clerkClient();
    const userCount = await client.users.getCount();

    let universityCount = 0;
    try {
      const data = await strapiFetch("/profiles?pagination[pageSize]=100&fields[0]=university");
      const universities = new Set(
        (data.data || [])
          .map((entry) => (entry.attributes || entry).university)
          .filter(Boolean)
      );
      universityCount = universities.size;
    } catch {
      // Strapi profile lookup failing shouldn't take down the homepage —
      // just fall back to 0 for this one number.
    }

    return NextResponse.json({ userCount, universityCount });
  } catch (err) {
    console.error("GET /api/stats failed:", err);
    return NextResponse.json({ userCount: 0, universityCount: 0 });
  }
}
