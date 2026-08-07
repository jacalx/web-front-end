import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { strapiFetch, flattenProduct, isAdminUser } from "../../../../lib/strapi";
import { withLiveSellerInfo } from "../../../../lib/liveSellerInfo";

// This route reads the signed-in user via auth() (cookies/headers), so it
// can never be statically rendered — force Next.js to treat it as dynamic.
export const dynamic = "force-dynamic";

async function getRawProduct(id) {
  const data = await strapiFetch(`/products/${id}?populate=*`);
  return data.data;
}

// Only the seller who created the listing, or an admin (per Strapi's
// profile.role — the single source of truth for admin status), may
// edit or delete it.
async function assertOwnerOrAdmin(product) {
  const { userId } = await auth();
  if (!userId) return { ok: false, status: 401, message: "Sign in required" };

  const attrs = product.attributes || product;
  if (attrs.sellerId === userId) return { ok: true };

  if (await isAdminUser(userId)) return { ok: true };

  return { ok: false, status: 403, message: "You can only manage your own products" };
}

// GET /api/products/[id] — public, also increments the view counter.
export async function GET(_request, { params }) {
  try {
    const raw = await getRawProduct(params.id);
    if (!raw) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const attrs = raw.attributes || raw;
    await strapiFetch(`/products/${params.id}`, {
      method: "PUT",
      body: JSON.stringify({ data: { views: (attrs.views || 0) + 1 } }),
    }).catch(() => {}); // view-count failures shouldn't break the page

    const [product] = await withLiveSellerInfo([flattenProduct(raw)]);
    return NextResponse.json({ product });
  } catch (err) {
    console.error(`GET /api/products/${params.id} failed:`, err);
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
}

// PATCH /api/products/[id] — owner or admin only.
export async function PATCH(request, { params }) {
  try {
    const raw = await getRawProduct(params.id);
    if (!raw) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const permission = await assertOwnerOrAdmin(raw);
    if (!permission.ok) {
      return NextResponse.json({ error: permission.message }, { status: permission.status });
    }

    const body = await request.json();
    const updated = await strapiFetch(`/products/${params.id}`, {
      method: "PUT",
      body: JSON.stringify({ data: body }),
    });

    return NextResponse.json({ product: flattenProduct(updated.data) });
  } catch (err) {
    console.error(`PATCH /api/products/${params.id} failed:`, err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/products/[id] — owner or admin only.
export async function DELETE(_request, { params }) {
  try {
    const raw = await getRawProduct(params.id);
    if (!raw) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const permission = await assertOwnerOrAdmin(raw);
    if (!permission.ok) {
      return NextResponse.json({ error: permission.message }, { status: permission.status });
    }

    await strapiFetch(`/products/${params.id}`, { method: "DELETE" });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`DELETE /api/products/${params.id} failed:`, err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}