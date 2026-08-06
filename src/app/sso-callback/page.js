"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallback() {
  // Handles both sign-in and sign-up redirects. DomainGuard (mounted in
  // Providers.js) takes over right after this to enforce the school-email rule.
  return <AuthenticateWithRedirectCallback />;
}
