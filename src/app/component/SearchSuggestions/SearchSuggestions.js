// ===== SearchSuggestions =====
// The dropdown panel of live suggestions shown under a search input while
// the user types — a "Categories" section and a "Products" section, plus
// a "See all results" row. Purely presentational: all the matching/
// fetching happens in the useLiveSearch hook, this just renders whatever
// it's given and reports which row was picked.
//
// Props:
//   query            - current search text (used for highlighting matches)
//   categoryMatches  - string[] of matching category names
//   productMatches   - product objects from /api/products (title/name, category, price, image_url, id)
//   loading          - true while the product fetch is in flight
//   activeIndex      - index of the keyboard-highlighted row (-1 = none)
//   onHoverIndex(i)  - called when the mouse moves over row i
//   onSelectCategory(category)
//   onSelectProduct(product)
//   onSeeAll()

// Wraps the part of `text` that matches `query` in a <mark>, the same way
// Google/YouTube bold the matching letters in a suggestion.
function HighlightMatch({ text, query }) {
  if (!query) return text;
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <mark className="ssug-match">{text.slice(index, index + query.length)}</mark>
      {text.slice(index + query.length)}
    </>
  );
}

function SearchSuggestions({
  query,
  categoryMatches,
  productMatches,
  loading,
  activeIndex,
  onHoverIndex,
  onSelectCategory,
  onSelectProduct,
  onSeeAll,
}) {
  const hasResults = categoryMatches.length > 0 || productMatches.length > 0;

  return (
    <div className="ssug-dropdown" role="listbox">
      {loading && !hasResults && <div className="ssug-status">Searching...</div>}
      {!loading && !hasResults && <div className="ssug-status">No matches for &quot;{query}&quot;</div>}

      {categoryMatches.length > 0 && (
        <div className="ssug-section">
          <div className="ssug-section-label">Categories</div>
          {categoryMatches.map((c, i) => (
            <button
              type="button"
              key={`cat-${c}`}
              className={`ssug-row ${activeIndex === i ? "active" : ""}`}
              onMouseEnter={() => onHoverIndex(i)}
              onClick={() => onSelectCategory(c)}
              role="option"
              aria-selected={activeIndex === i}
            >
              <span className="ssug-row-text">
                <HighlightMatch text={c} query={query} />
              </span>
            </button>
          ))}
        </div>
      )}

      {productMatches.length > 0 && (
        <div className="ssug-section">
          <div className="ssug-section-label">Products</div>
          {productMatches.map((p, i) => {
            const rowIndex = categoryMatches.length + i;
            return (
              <button
                type="button"
                key={`prod-${p.id}`}
                className={`ssug-row ${activeIndex === rowIndex ? "active" : ""}`}
                onMouseEnter={() => onHoverIndex(rowIndex)}
                onClick={() => onSelectProduct(p)}
                role="option"
                aria-selected={activeIndex === rowIndex}
              >
                {p.image_url ? (
                  <img className="ssug-thumb" src={p.image_url} alt="" />
                ) : (
                  <span className="ssug-thumb ssug-thumb-empty" />
                )}
                <span className="ssug-row-text">
                  <span className="ssug-row-title">
                    <HighlightMatch text={p.title || p.name || ""} query={query} />
                  </span>
                  <span className="ssug-row-meta">{p.category} · ${p.price}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      {query.trim() && (
        <button type="button" className="ssug-row ssug-row-seeall" onClick={onSeeAll}>
          See all results for &quot;{query}&quot;
        </button>
      )}
    </div>
  );
}

export default SearchSuggestions;