// ===== ProductCard Component =====
// Editorial card: large image, clean typography, seller trust row.

import Link from "next/link";
import { FaHeart, FaRegEye, FaUserCircle } from "react-icons/fa";
import { useApp } from "../../../context/AppContext";

function ProductCard({ product }) {
  const { isInWishlist, toggleWishlist } = useApp();
  const inWishlist = isInWishlist(product.id);

  return (
    <div className="pc">
      <div className="pc-img-wrap">
        <Link href={`/product/${product.id}`}>
          <img
            src={product.image_url || "/placeholder-product.png"}
            alt={product.title}
            className="pc-img"
            loading="lazy"
          />
        </Link>
        <button
          className={`pc-heart ${inWishlist ? "active" : ""}`}
          onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
          aria-label="Toggle wishlist"
        >
          <FaHeart />
        </button>
        <Link href={`/product/${product.id}`} className="pc-quickview" aria-label="Quick view">
          <FaRegEye /> View Details
        </Link>
      </div>

      <div className="pc-body">
        <div className="pc-meta-top">
          <span className="pc-cat">{product.category}</span>
        </div>

        <Link href={`/product/${product.id}`}>
          <h3 className="pc-name">{product.title}</h3>
        </Link>

        <div className="pc-price-row">
          <span className="pc-price">${product.price}</span>
        </div>

        {product.seller_name && (
          <div className="pc-seller">
            {product.seller_avatar ? (
              <img src={product.seller_avatar} alt={product.seller_name} className="pc-seller-avatar" />
            ) : (
              <FaUserCircle className="pc-seller-avatar" />
            )}
            <div className="pc-seller-info">
              <span className="pc-seller-name">{product.seller_name}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
