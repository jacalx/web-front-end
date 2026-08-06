"use client";
// ===== useLiveSearch hook =====
// Shared logic behind the "type-ahead" search suggestions (like YouTube/
// Google): as the user types, this returns matching categories (filtered
// instantly from the fixed local category list) and matching products
// (fetched live from /api/products, debounced so we don't spam the
// network on every keystroke). Used by both the desktop and mobile search
// bars in the Navbar so the behaviour stays identical in one place.

import { useState, useEffect, useRef } from "react";
import { categories } from "../../data/products";

const DEBOUNCE_MS = 250;
const MAX_PRODUCT_SUGGESTIONS = 5;

export function useLiveSearch(query) {
  const [categoryMatches, setCategoryMatches] = useState([]);
  const [productMatches, setProductMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef(null);
  const requestIdRef = useRef(0); // guards against an older, slower response overwriting a newer one

  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setCategoryMatches([]);
      setProductMatches([]);
      setLoading(false);
      return;
    }

    setCategoryMatches(
      categories.filter((c) => c.toLowerCase().includes(trimmed.toLowerCase())).slice(0, 4)
    );
    setLoading(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const thisRequestId = ++requestIdRef.current;
      try {
        const res = await fetch(
          `/api/products?search=${encodeURIComponent(trimmed)}&pageSize=${MAX_PRODUCT_SUGGESTIONS}`
        );
        const data = await res.json();
        if (thisRequestId === requestIdRef.current) {
          setProductMatches(data.products || []);
        }
      } catch {
        if (thisRequestId === requestIdRef.current) setProductMatches([]);
      } finally {
        if (thisRequestId === requestIdRef.current) setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  return { categoryMatches, productMatches, loading };
}