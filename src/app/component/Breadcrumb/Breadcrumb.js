// ===== Breadcrumb Component =====
// Shows the navigation path (e.g., Home > Marketplace > Product Detail).
// Props:
//   - items: array of { label, to } objects. The last item is the current page.

import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";

function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="breadcrumb-item">
              {index > 0 && <FaChevronRight className="breadcrumb-separator" />}

              {isLast ? (
                <span className="breadcrumb-current">{item.label}</span>
              ) : (
                <Link href={item.to} className="breadcrumb-link">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
