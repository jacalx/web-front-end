// ===== SearchBar Component =====
// A reusable search input with an icon and optional search button.
// When the user types and presses Enter (or clicks Search), it navigates
// to the marketplace page with the search query as a URL parameter.
// Props:
//   - onSearch: optional callback function that receives the search term
//   - placeholder: custom placeholder text (default provided)

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";

function SearchBar({ onSearch, placeholder = "Search products, categories, universities..." }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else {
      router.push(`/marketplace?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form className="searchbar" onSubmit={handleSubmit}>
      <FaSearch className="searchbar-icon" />
      <input
        type="text"
        className="searchbar-input"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className="searchbar-btn">Search</button>
    </form>
  );
}

export default SearchBar;
