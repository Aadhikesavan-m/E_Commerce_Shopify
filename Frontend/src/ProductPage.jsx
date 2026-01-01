import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import "./product.css";

// Component to display star rating
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="star-rating">
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} className="star full">
          ★
        </span>
      ))}
      {hasHalfStar && <span className="star half">½</span>}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="star empty">
          ★
        </span>
      ))}
      <span className="rating-value">({rating.toFixed(1)})</span>
    </div>
  );
};

export default function ProductPage({ cart, setCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  // Fetch single product data
  useEffect(() => {
    async function fetchProduct() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data = await response.json();
        setProduct(data);
        setMainImage(data.thumbnail || (data.images && data.images[0]));
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Calculate price with consistent 10x multiplication
  const calculatedPrice = useMemo(() => {
    if (!product) return { original: 0, discounted: 0, discountAmount: 0 };

    // Convert to INR (multiply by 10)
    const priceInINR = product.price * 10;

    // Apply discount if available
    if (product.discountPercentage) {
      const discountAmount = priceInINR * (product.discountPercentage / 100);
      return {
        original: priceInINR,
        discounted: priceInINR - discountAmount,
        discountAmount: discountAmount,
      };
    }

    return {
      original: priceInINR,
      discounted: priceInINR,
      discountAmount: 0,
    };
  }, [product]);

  // Calculate original price (before discount)
  const originalPrice = useMemo(() => {
    if (!product) return 0;
    if (product.discountPercentage) {
      return (product.price * 10) / (1 - product.discountPercentage / 100);
    }
    return product.price * 10;
  }, [product]);

  // Add to cart
  function handleAddToCart(p) {
    const exists = cart.find((item) => item.id === p.id);
    if (!exists) {
      setCart([
        ...cart,
        {
          ...p,
          qty: 1,
          // Store the calculated price in INR
          priceInINR: calculatedPrice.discounted,
          originalPriceInINR: originalPrice,
        },
      ]);
    } else {
      setCart(
        cart.map((item) =>
          item.id === p.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    }
  }

  // Check if item is already in cart for button text/styling
  const isInCart = useMemo(
    () => cart.some((item) => item.id === product?.id),
    [cart, product]
  );

  if (isLoading) {
    return (
      <div className="product-page-loading">
        <h2>Loading Product Details...</h2>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-page-error">
        <h2>{error || "Product Data Missing"}</h2>
        <Link to="/">Go back to shop</Link>
      </div>
    );
  }

  return (
    <div className="product-page-container">
      <button className="back-button" onClick={() => navigate("/")}>
        <ArrowLeft size={20} />
        Continue Shopping
      </button>

      <nav className="breadcrumb">
        <Link to="/"> Shop</Link>/ <span>{product.title}</span>
      </nav>

      <div className="product-detail-card">
        <div className="gallery-section">
          <div className="main-image-container">
            <img src={mainImage} alt={product.title} className="main-image" />
          </div>
          <div className="thumbnail-gallery">
            {product.images?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className={`thumbnail ${mainImage === img ? "active" : ""}`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        <div className="details-section">
          <p className="p-brand">{product.brand}</p>
          <h1 className="p-title">{product.title}</h1>
          <StarRating rating={product.rating} />

          <div className="price-section">
            {product.discountPercentage > 0 ? (
              <>
                <div className="discounted-price-row">
                  <span className="p-price">
                    ₹{calculatedPrice.discounted.toFixed(2)}
                  </span>
                  <span className="p-discount">
                    ({product.discountPercentage}% OFF)
                  </span>
                </div>
                <div className="original-price-row">
                  <span className="p-original-price">
                    ₹{originalPrice.toFixed(2)}
                  </span>
                  <span className="save-amount">
                    Save ₹{calculatedPrice.discountAmount.toFixed(2)}
                  </span>
                </div>
              </>
            ) : (
              <span className="p-price">
                ₹{calculatedPrice.original.toFixed(2)}
              </span>
            )}
          </div>

          <p
            className={`p-stock ${
              product.stock > 0 ? "in-stock" : "out-of-stock"
            }`}
          >
            {product.stock > 0
              ? `In Stock: ${product.stock} units left`
              : "Out of Stock"}
          </p>

          <div className="actions">
            <button
              className={`add-to-cart-btn ${isInCart ? "in-cart" : ""}`}
              onClick={() => handleAddToCart(product)}
              disabled={product.stock === 0}
            >
              {product.stock === 0
                ? "Out of Stock"
                : isInCart
                ? "Added! Buy More"
                : "Add to Cart"}
            </button>
            <button className="buy-now-btn" disabled={product.stock === 0}>
              Buy Now
            </button>
          </div>

          <div className="description-section">
            <h2>Product Overview</h2>
            <p>{product.description}</p>
          </div>

          <div className="specs-section">
            <h2>Specifications</h2>
            <ul>
              <li>
                <span className="spec-label">Category:</span> {product.category}
              </li>
              <li>
                <span className="spec-label">SKU:</span> {product.sku || "N/A"}
              </li>
              <li>
                <span className="spec-label">Weight:</span>{" "}
                {product.weight || "N/A"}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
