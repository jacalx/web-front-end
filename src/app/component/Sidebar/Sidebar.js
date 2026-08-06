// ===== Sidebar Component =====
// A vertical navigation sidebar used on the Home page or dashboard pages.
// Shows quick links and category navigation.
// Props:
//   - items: array of { label, to, icon } objects

import Link from "next/link";
import { usePathname } from "next/navigation";

function Sidebar({ items, title = "Menu" }) {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <h3 className="sidebar-title">{title}</h3>
      <ul className="sidebar-list">
        {items.map((item, index) => {
          const isActive = pathname === item.to;

          return (
            <li key={index}>
              <Link
                href={item.to}
                className={`sidebar-link ${isActive ? "active" : ""}`}
              >
                {item.icon && <span className="sidebar-icon">{item.icon}</span>}
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default Sidebar;
