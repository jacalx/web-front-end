import { clerkClient } from "@clerk/nextjs/server";

// Products store a SNAPSHOT of the seller's name/avatar/email from when the
// listing was created — that's what caused the stale-photo bug (profile
// picture changed after posting, but the old one stayed on the listing).
// This overwrites those fields with the seller's CURRENT Clerk profile.
export async function withLiveSellerInfo(products) {
  const uniqueSellerIds = [...new Set(products.map((p) => p.seller_id).filter(Boolean))];
  if (uniqueSellerIds.length === 0) return products;

  const client = await clerkClient();
  const liveById = {};

  await Promise.all(
    uniqueSellerIds.map(async (id) => {
      try {
        const u = await client.users.getUser(id);
        liveById[id] = {
          name: u.unsafeMetadata?.fullName || u.fullName || u.firstName || "Student",
          avatar: u.imageUrl,
          email: u.emailAddresses?.[0]?.emailAddress || "",
          university: u.unsafeMetadata?.university || "",
        };
      } catch {
        // Seller account may have been deleted — fall back to the snapshot silently.
      }
    })
  );

  return products.map((p) => {
    const live = liveById[p.seller_id];
    if (!live) return p;
    return {
      ...p,
      seller_name: live.name,
      seller_avatar: live.avatar,
      seller_email: live.email,
      seller_university: live.university,
    };
  });
}