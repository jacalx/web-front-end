"use client";
// Previously enforced a school-email-only rule. That's been dropped —
// any email/social account is allowed now. Kept as a no-op so Providers.js
// doesn't need to change, in case domain restriction comes back later.

export default function DomainGuard() {
  return null;
}
