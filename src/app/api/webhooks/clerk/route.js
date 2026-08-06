import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { strapiFetch } from "../../../../lib/strapi";

// POST /api/webhooks/clerk — receives Clerk account lifecycle events.
//
// Why this exists: deleting a user in Clerk (from the Clerk Dashboard, or
// the user deleting their own account) only removes them from Clerk. Their
// Strapi `profile` row and any `product` listings they created live in a
// completely separate database that Clerk has no way to reach on its own —
// so without this webhook, "deleted" users keep showing up as sellers
// forever. This listens for Clerk's `user.deleted` event and cleans up the
// matching Strapi records.
//
// Setup required (can't be done from code):
//   1. `npm install svix` in this project.
//   2. In the Clerk Dashboard → Webhooks, add an endpoint pointing at
//      <your-deployed-url>/api/webhooks/clerk, subscribed to `user.deleted`.
//   3. Copy the "Signing Secret" Clerk gives you into this project's
//      environment as CLERK_WEBHOOK_SECRET.
export async function POST(request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    console.error("CLERK_WEBHOOK_SECRET is not set — refusing unverifiable webhook.");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const payload = await request.text();
  const headers = {
    "svix-id": request.headers.get("svix-id"),
    "svix-timestamp": request.headers.get("svix-timestamp"),
    "svix-signature": request.headers.get("svix-signature"),
  };

  let event;
  try {
    event = new Webhook(secret).verify(payload, headers);
  } catch (err) {
    console.error("Clerk webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "user.deleted") {
    // We only care about deletions right now — ack everything else so
    // Clerk doesn't retry events we intentionally ignore.
    return NextResponse.json({ received: true });
  }

  const clerkId = event.data?.id;
  if (!clerkId) {
    return NextResponse.json({ received: true });
  }

  try {
    await Promise.all([deleteProfile(clerkId), deleteProducts(clerkId)]);
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(`Clerk webhook cleanup failed for user ${clerkId}:`, err);
    // Still 200 — Clerk will retry on non-2xx, and a partial cleanup
    // failure shouldn't loop forever. The error is logged for follow-up.
    return NextResponse.json({ received: true, cleanupError: err.message });
  }
}

async function deleteProfile(clerkId) {
  const query = new URLSearchParams();
  query.set("filters[clerkId][$eq]", clerkId);
  query.set("pagination[pageSize]", "1");
  const data = await strapiFetch(`/profiles?${query.toString()}`);
  const profile = data.data?.[0];
  if (!profile) return;
  const documentId = profile.documentId || profile.id;
  await strapiFetch(`/profiles/${documentId}`, { method: "DELETE" });
}

async function deleteProducts(clerkId) {
  const query = new URLSearchParams();
  query.set("filters[sellerId][$eq]", clerkId);
  query.set("pagination[pageSize]", "100");
  const data = await strapiFetch(`/products?${query.toString()}`);
  const products = data.data || [];
  await Promise.all(
    products.map((p) => strapiFetch(`/products/${p.documentId || p.id}`, { method: "DELETE" }))
  );
}
