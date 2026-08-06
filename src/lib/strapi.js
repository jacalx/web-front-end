// Server-only helper for calling the Strapi backend. Never import this
// from a "use client" file — STRAPI_API_TOKEN must stay on the server.

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_URL || !STRAPI_API_TOKEN) {
  console.warn(
    "STRAPI_URL / STRAPI_API_TOKEN are not set — product features will fail until .env.local is configured."
  );
}

// Low-level fetch wrapper: talks to Strapi's REST API (Content-Type "product").
export async function strapiFetch(path, options = {}) {
  const res = await fetch(`${STRAPI_URL}/api${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      ...(options.body && !(options.body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...options.headers,
    },
    cache: "no-store", // product data changes often — never let Next.js cache stale listings
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    console.error(`strapiFetch ${options.method || "GET"} ${path} failed:`, JSON.stringify(data, null, 2));
    const message = data?.error?.message || `Strapi request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

// Turns a Strapi v4/v5 "product" entry into the flat shape ProductCard,
// the product detail page, etc. already expect (title / image_url /
// seller_name / created_at — snake_case, single image_url) from an
// earlier partial integration attempt. Matching it means zero UI changes.
export function flattenProduct(entry) {
  if (!entry) return null;
  // Strapi v4 wraps fields in { id, attributes: {...} }; v5 flattens them.
  // This works whichever version your Strapi instance uses.
  const attrs = entry.attributes || entry;
  const images = attrs.images || [];
  return {
    // Strapi 5 requires documentId (a string) for single-item lookups
    // (GET/PATCH/DELETE /api/products/:id) — the numeric id only works
    // for Strapi 4. Prefer documentId when present so links/detail pages
    // work on either version.
    id: String(entry.documentId || entry.id),
    title: attrs.title,
    name: attrs.title, // alias — a few older components still read .name
    description: attrs.description,
    category: attrs.category,
    condition: attrs.condition,
    price: attrs.price,
    // "status" is a Strapi-reserved field name, so the schema field is
    // called productStatus — flattened back to `status` here so the UI
    // doesn't need to know about that quirk.
    status: attrs.productStatus || "available",
    images,
    image_url: images[0] || "",
    university: attrs.university || "",
    location: attrs.location || "",
    views: attrs.views || 0,
    seller_id: attrs.sellerId,
    seller_name: attrs.sellerName,
    seller_email: attrs.sellerEmail,
    seller_avatar: attrs.sellerAvatar,
    created_at: attrs.createdAt,
    date: attrs.createdAt, // alias — some components sort/display by .date
  };
}

// Server-side admin check, backed by Strapi's `profile.role` field — the
// single source of truth for admin status (see requirement #5: role lives
// in Strapi, not Clerk publicMetadata). Used by API routes to protect the
// backend itself, not just the UI that calls them.
export async function isAdminUser(clerkId) {
  if (!clerkId) return false;
  try {
    const query = new URLSearchParams();
    query.set("filters[clerkId][$eq]", clerkId);
    query.set("pagination[pageSize]", "1");
    const data = await strapiFetch(`/profiles?${query.toString()}`);
    const profile = data.data?.[0];
    const attrs = profile?.attributes || profile;
    return attrs?.role === "admin";
  } catch (err) {
    console.error("isAdminUser check failed:", err);
    return false; // fail closed — never grant admin on an error
  }
}
