import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { strapiFetch, flattenProduct } from "../../../lib/strapi";
import { withLiveSellerInfo } from "../../../lib/liveSellerInfo";

// POST below reads the signed-in user via auth() (cookies/headers), so this
// whole route file can never be statically rendered — force it dynamic.
export const dynamic = "force-dynamic";

// GET /api/products?category=Books&search=laptop&page=1
// Public — anyone can browse the marketplace, signed in or not.
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const query = new URLSearchParams();
    query.set("populate", "*");
    query.set("sort", "createdAt:desc");
    query.set("pagination[pageSize]", searchParams.get("pageSize") || "100");
    query.set("pagination[page]", searchParams.get("page") || "1");

    if (searchParams.get("category")) {
      query.set("filters[category][$eq]", searchParams.get("category"));
    }
    if (searchParams.get("sellerId")) {
      query.set("filters[sellerId][$eq]", searchParams.get("sellerId"));
    }
    if (searchParams.get("search")) {
      query.set("filters[title][$containsi]", searchParams.get("search"));
    }

    const data = await strapiFetch(`/products?${query.toString()}`);
    const products = await withLiveSellerInfo((data.data || []).map(flattenProduct));

    return NextResponse.json({ products });
  } catch (err) {
    console.error("GET /api/products failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/products — create a listing. Requires a signed-in Clerk user;
// seller fields are taken from the authenticated session, never from the
// request body, so nobody can post a listing "as" someone else.
export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "You must be signed in to sell a product" }, { status: 401 });
    }

    const user = await currentUser();
    const body = await request.json();

    const { title, description, category, condition, price, images, university, location } = body;
    if (!title || !category || !price) {
      return NextResponse.json({ error: "Title, category, and price are required" }, { status: 400 });
    }

    const created = await strapiFetch("/products", {
      method: "POST",
      body: JSON.stringify({
        data: {
          title,
          description,
          category,
          condition,
          price,
          images: images || [],
          university,
          location,
          productStatus: "available",
          views: 0,
          sellerId: userId,
          sellerName: user?.unsafeMetadata?.fullName || user?.fullName || "Student",
          sellerEmail: user?.primaryEmailAddress?.emailAddress || "",
          sellerAvatar: user?.imageUrl || "",
        },
      }),
    });

    return NextResponse.json({ product: flattenProduct(created.data) }, { status: 201 });
  } catch (err) {
    console.error("POST /api/products failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}