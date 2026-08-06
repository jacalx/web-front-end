"use client";
// ===== Marketplace Page =====
// Modern browsing: filter chips, floating sort, premium grid.

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaSearch, FaSlidersH, FaTimes, FaSort, FaChevronDown } from "react-icons/fa";
import FilterPanel from "../component/FilterPanel/FilterPanel";
import ProductCard from "../component/ProductCard/ProductCard";
import Pagination from "../component/Pagination/Pagination";
import Breadcrumb from "../component/Breadcrumb/Breadcrumb";
import { categories } from "../../data/products";

function Marketplace() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "newest";
  const [filters, setFilters] = useState({
    search: search,
    category: category,
    minPrice: "",
    maxPrice: "",
    sort: sort,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const productsPerPage = 12;

  useEffect(() => {
    let ignore = false;
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (ignore) return;
        if (!res.ok) {
          setLoadError(data.error || "Failed to load products");
        } else {
          setProducts(data.products || []);
          setLoadError(null);
        }
      } catch (err) {
        if (!ignore) setLoadError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchProducts();
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "",
      sort: searchParams.get("sort") || "newest",
    }));
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter((p) =>
        p.title.toLowerCase().includes(query) ||
        (p.description || "").toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }
    if (filters.category) result = result.filter((p) => p.category === filters.category);
    if (filters.minPrice) result = result.filter((p) => p.price >= Number(filters.minPrice));
    if (filters.maxPrice) result = result.filter((p) => p.price <= Number(filters.maxPrice));

    switch (filters.sort) {
      case "newest": result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); break;
      case "oldest": result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)); break;
      case "price-low": result.sort((a, b) => a.price - b.price); break;
      case "price-high": result.sort((a, b) => b.price - a.price); break;
      default: break;
    }
    return result;
  }, [filters, products]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  useEffect(() => { setCurrentPage(1); }, [filters]);

  useEffect(() => {
    setIsRefreshing(true);
    const t = setTimeout(() => setIsRefreshing(false), 300);
    return () => clearTimeout(t);
  }, [filters, currentPage]);

  const handleFilterChange = (newFilters) => setFilters(newFilters);
  const handleReset = () => {
    setFilters({ search: "", category: "", minPrice: "", maxPrice: "", sort: "newest" });
  };

  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
  ];
  const currentSortLabel = sortOptions.find((s) => s.value === filters.sort)?.label || "Sort";

  const activeChips = [];
  if (filters.category) activeChips.push({ key: "category", label: filters.category });
  if (filters.minPrice) activeChips.push({ key: "minPrice", label: `Min $${filters.minPrice}` });
  if (filters.maxPrice) activeChips.push({ key: "maxPrice", label: `Max $${filters.maxPrice}` });

  return (
    <div className="marketplace page-fade">
      <div className="marketplace-container">
        <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Marketplace" }]} />

        <div className="marketplace-header">
          <h1 className="marketplace-title">Marketplace</h1>
          <p className="marketplace-subtitle">{filteredProducts.length} products from verified students</p>
        </div>

        {/* Filter chips row */}
        <div className="marketplace-chips">
          <button className="marketplace-filter-toggle" onClick={() => setShowFilters(!showFilters)}>
            <FaSlidersH /> Filters
          </button>
          <div className="marketplace-chip-scroll">
            <button
              className={`marketplace-chip ${!filters.category ? "active" : ""}`}
              onClick={() => updateFilter("category", "")}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`marketplace-chip ${filters.category === cat ? "active" : ""}`}
                onClick={() => updateFilter("category", cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* Sort dropdown */}
          <div className="marketplace-sort-wrap">
            <button className="marketplace-sort-btn" onClick={() => setSortOpen(!sortOpen)}>
              <FaSort /> {currentSortLabel} <FaChevronDown className={`marketplace-sort-chevron ${sortOpen ? "open" : ""}`} />
            </button>
            {sortOpen && (
              <div className="marketplace-sort-menu">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    className={`marketplace-sort-option ${filters.sort === opt.value ? "active" : ""}`}
                    onClick={() => { updateFilter("sort", opt.value); setSortOpen(false); }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Active filter chips */}
        {activeChips.length > 0 && (
          <div className="marketplace-active-chips">
            {activeChips.map((chip) => (
              <button key={chip.key} className="marketplace-active-chip" onClick={() => updateFilter(chip.key, "")}>
                {chip.label} <FaTimes />
              </button>
            ))}
            <button className="marketplace-clear-all" onClick={handleReset}>Clear All</button>
          </div>
        )}

        {/* Filter panel (collapsible) */}
        {showFilters && (
          <div className="marketplace-filter-panel">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleReset}
            />
          </div>
        )}

        {/* Grid */}
        {loading || isRefreshing ? (
          <div className="marketplace-grid" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="pc-skel" key={i}>
                <div className="skeleton pc-skel-img" />
                <div className="pc-skel-body">
                  <div className="skeleton pc-skel-line" style={{ width: "35%" }} />
                  <div className="skeleton pc-skel-line" style={{ width: "80%" }} />
                  <div className="skeleton pc-skel-line" style={{ width: "45%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : loadError ? (
          <div className="marketplace-empty">
            <FaSearch className="marketplace-empty-icon" />
            <h3>Couldn&apos;t load products</h3>
            <p>{loadError}</p>
          </div>
        ) : currentProducts.length > 0 ? (
          <div className="marketplace-grid">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="marketplace-empty">
            <FaSearch className="marketplace-empty-icon" />
            <h3>No products found</h3>
            <p>Try adjusting your filters or search terms.</p>
            <button className="marketplace-empty-btn" onClick={handleReset}>Clear Filters</button>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default Marketplace;
