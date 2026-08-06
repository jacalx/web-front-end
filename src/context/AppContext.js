// ===== AppContext - Global State Management =====
// This file creates a React Context that manages global state using React Hooks.
// It handles: current user profile (backed by Strapi), wishlist, and recently viewed products.
// Wishlist/recentlyViewed are persisted in LocalStorage. Profile data (name/phone/
// university/bio/role) is persisted in Strapi via /api/profile — that is the single
// source of truth for both email/password and Google-signed-in users.

import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { useUser, useClerk } from "@clerk/nextjs";

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerk();

  const [wishlist, setWishlist] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  const [profile, setProfile] = useState(null); // raw Strapi profile: { fullName, phone, university, bio, avatarUrl, role, ... }
  const [profileLoading, setProfileLoading] = useState(true);

  // Fetch (and, on the server, auto-create) the Strapi profile for whoever
  // is currently signed in. This is what makes Google sign-ins automatically
  // get a Strapi profile with no extra step — see GET /api/profile.
  const refreshProfile = useCallback(async () => {
    if (!clerkUser) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }
    setProfileLoading(true);
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      setProfile(res.ok ? data.profile : null);
    } catch {
      setProfile(null);
    }
    setProfileLoading(false);
  }, [clerkUser]);

  useEffect(() => {
    if (!clerkLoaded) return;
    refreshProfile();
  }, [clerkLoaded, refreshProfile]);

  // currentUser = identity from Clerk (id/email never change here) + profile
  // fields from Strapi (fullName/phone/university/bio/avatar/role — the
  // editable, source-of-truth data). While the Strapi profile is still
  // loading, fall back to Clerk's own basics so the UI doesn't flash empty.
  const currentUser = clerkUser
    ? {
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || "",
        name: profile?.fullName || clerkUser.fullName || clerkUser.firstName || "Student",
        phone: profile?.phone || "",
        university: profile?.university || "",
        bio: profile?.bio || "",
        avatar: profile?.avatarUrl || clerkUser.imageUrl || `https://i.pravatar.cc/150?u=${clerkUser.id}`,
        isAdmin: profile?.role === "admin", // role lives only in Strapi — never in Clerk metadata
      }
    : null;

  // Load wishlist/recentlyViewed from localStorage on the client only (avoids SSR crash)
  useEffect(() => {
    const savedWishlist = localStorage.getItem("sm_wishlist");
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

    const savedRecent = localStorage.getItem("sm_recentlyViewed");
    if (savedRecent) setRecentlyViewed(JSON.parse(savedRecent));

    setHydrated(true);
  }, []);

  // Guarded by `hydrated`: on mount, wishlist/recentlyViewed start as `[]`
  // and the "load from localStorage" effect above only *schedules* a state
  // update — it hasn't landed yet when React runs this effect in the same
  // pass. Without the guard, this effect fires first with the stale `[]`
  // value and immediately overwrites whatever was actually saved, which is
  // why the wishlist appeared to reset after a refresh.
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("sm_wishlist", JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("sm_recentlyViewed", JSON.stringify(recentlyViewed));
  }, [recentlyViewed, hydrated]);

  // ===== Auth Functions =====
  const logout = () => {
    clerkSignOut();
  };

  // Update profile: writes to Strapi via PUT /api/profile (never touches
  // Clerk metadata — Strapi is the only place this data lives now). Avatar
  // files still go through Clerk's own image hosting (it's genuinely the
  // best place to store an actual photo), and the resulting URL is saved
  // into Strapi's avatarUrl field so display logic only has one place to look.
  const updateProfile = async (updates) => {
    if (!clerkUser) return;

    let avatarUrl;
    if (updates.avatarFile) {
      const updatedUser = await clerkUser.setProfileImage({ file: updates.avatarFile });
      avatarUrl = updatedUser?.imageUrl || clerkUser.imageUrl;
    }

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...(updates.name !== undefined ? { fullName: updates.name } : {}),
        ...(updates.phone !== undefined ? { phone: updates.phone } : {}),
        ...(updates.university !== undefined ? { university: updates.university } : {}),
        ...(updates.bio !== undefined ? { bio: updates.bio } : {}),
        ...(avatarUrl !== undefined ? { avatarUrl } : {}),
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update profile");
    setProfile(data.profile);
  };

  // ===== Wishlist Functions =====
  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  const removeFromWishlist = (productId) => {
    setWishlist(wishlist.filter((id) => id !== productId));
  };

  // ===== Recently Viewed Functions =====
  const addToRecentlyViewed = (productId) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 10);
    });
  };

  const value = {
    currentUser,
    profileLoading,
    logout,
    updateProfile,
    wishlist,
    toggleWishlist,
    isInWishlist,
    removeFromWishlist,
    recentlyViewed,
    addToRecentlyViewed,
    hydrated: hydrated && clerkLoaded && !profileLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;