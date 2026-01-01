import React, { useEffect, useState, useRef } from "react";
import "./atc.css";
import { Link, useNavigate } from "react-router-dom";
import Img from "./assets/no search.jpg";
import banner1 from "./assets/Banner/banner.avif";
import banner2 from "./assets/Banner/banner2.avif";
import banner3 from "./assets/Banner/banner3.avif";
import card1 from "./assets/offer-card/card1.avif";
import card2 from "./assets/offer-card/card2.avif";
import UserModal from "./userModal";
import { ChevronUp } from "lucide-react"; // Import icon for the button

function AddtoCart({ cart, setCart }) {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Shop All");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const navigate = useNavigate();
  const topRef = useRef(null);

  const images = [banner1, banner2, banner3];
  const [index, setIndex] = useState(0);

  const year = new Date().getFullYear();

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Show/hide scroll-to-top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch loggedin User
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Failed to fetch user");
      }
    };

    fetchUser();
  }, []);

  // user detail
  const icon = user ? user.username.charAt(0).toUpperCase() : "👤";

  // handleLogout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  // Banner change
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [images.length]);

  // Load all products
  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch("https://dummyjson.com/products?limit=0");
        const data = await response.json();
        const productsWithStock = data.products.map((p) => ({
          ...p,
          inStock: (p.stock || 10) > 0,
        }));
        setProducts(productsWithStock);
        setAllProducts(productsWithStock);
      } catch (error) {
        alert("Error loading products: " + error.message);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Add to cart - Store calculated prices
  function handleAddToCart(product) {
    const exists = cart.find((item) => item.id === product.id);
    if (!exists) {
      // Calculate prices consistently
      const priceInINR = product.price * 10;
      const discountAmount = priceInINR * (product.discountPercentage / 100);
      const discountedPrice = priceInINR - discountAmount;
      const originalPrice = priceInINR / (1 - product.discountPercentage / 100);
      
      setCart([...cart, { 
        ...product, 
        qty: 1,
        priceInINR: discountedPrice,
        originalPriceInINR: originalPrice
      }]);
    }
  }

  // Search Filter
  function searchBar(value) {
    setSearch(value);
    setActiveCategory("Shop All");

    const filtered = allProducts.filter(
      (item) =>
        item.title?.toLowerCase().includes(value.toLowerCase()) ||
        item.category?.toLowerCase().includes(value.toLowerCase()) ||
        item.description?.toLowerCase().includes(value.toLowerCase())
    );
    setProducts(filtered);
  }

  // Category Filter
  function filterByCategory(category) {
    setActiveCategory(category);
    setSearch("");

    if (category === "Shop All") {
      setProducts(allProducts);
      return;
    }

    const filtered = allProducts.filter(
      (item) =>
        item.category?.toLowerCase().includes(category.toLowerCase()) ||
        item.title?.toLowerCase().includes(category.toLowerCase())
    );

    setProducts(filtered);
  }

  // Calculate original price (before discount) in INR
  const getOriginalPrice = (item) => {
    const discountedPrice = item.price * 10;
    const discountPercentage = item.discountPercentage || 0;
    
    if (discountPercentage > 0) {
      return (discountedPrice / (1 - discountPercentage / 100));
    }
    return discountedPrice;
  };

  // Calculate discounted price in INR
  const getDiscountedPrice = (item) => {
    const priceInINR = item.price * 10;
    const discountPercentage = item.discountPercentage || 0;
    
    if (discountPercentage > 0) {
      const discountAmount = priceInINR * (discountPercentage / 100);
      return priceInINR - discountAmount;
    }
    return priceInINR;
  };

  return (
    <div className="shop-page" ref={topRef}>
      {/* MARQUEE */}
      <div className="marquee-container">
        <div className="marquee">
          <span>🔥 Mega Sale! Upto 50% Off on all products — Hurry!</span>
          <span>🚚 Free Delivery on orders above ₹499</span>
          <span>🎁 New Arrivals are Live Now!</span>
        </div>
      </div>

      {/* NAVBAR */}
      <nav className="navbar">
        <h1 className="logo">Shopify!</h1>

        <ul>
          <li>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search…"
                value={search}
                onChange={(e) => searchBar(e.target.value)}
                className="search-bar"
              />
              <button className="search-icon">🔍</button>
            </div>
          </li>
        </ul>

        <Link to="/cart">
          <button className="cart-btn">
            🛒 <span className="cart-count">{cart.length}</span>
          </button>
        </Link>
        <div className="user-auth-wrapper">
          <span
            className="avatar"
            onClick={() => setShowUserModal((prev) => !prev)}
          >
            {icon}
          </span>
        </div>
      </nav>
      {showUserModal && (
        <UserModal
          user={user}
          onClose={() => setShowUserModal(false)}
          onLogout={handleLogout}
        />
      )}

      {/* BODY */}
      {isLoading ? (
        <h2 style={{ textAlign: "center", marginTop: "120px" }}>Loading...</h2>
      ) : (
        <div className="body">
          {/* CATEGORY FILTER */}
          <div className="category-container">
            <ul className="category-list">
              {[
                "Shop All",
                "Tablets",
                "Groceries",
                "Beauty",
                "Kitchen",
                "Mobile",
                "Motorcycle",
                "Watches",
              ].map((cat) => (
                <li
                  key={cat}
                  className={activeCategory === cat ? "active" : ""}
                  onClick={() => filterByCategory(cat)}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>

          {/* HIDE BANNERS WHEN SEARCH OR CATEGORY FILTER ACTIVE */}
          {search === "" && activeCategory === "Shop All" && (
            <>
              {/* MAIN BANNER */}
              <div className="banner">
                <img src={images[index]} alt="banner" className="banner-img" />

                <div className="banner-overlay">
                  <p className="offer">Best Prices</p>
                  <h2 className="banner-head">
                    Incredible Prices <br />
                    on All Your <br />
                    Favourite Items
                  </h2>
                  <p className="banner-para">
                    Get more for less on selected brands
                  </p>

                  <button className="banner-button">Shop Now</button>
                </div>
              </div>

              {/* DUAL BANNER */}
              <div className="dual-banner">
                <div className="banner-box left-banner d-b-1">
                  <div className="banner-content ">
                    <p className="banner-small">Holiday Deals</p>
                    <h1 className="banner-title">
                      Up to
                      <br />
                      30% off
                    </h1>
                    <p className="banner-desc">Selected Smartphone Brands</p>

                    <button className="banner-btn">Shop</button>
                  </div>

                  <img src={card1} alt="Phone" className="banner-image" />
                </div>

                <div className="banner-box right-banner">
                  <div className="banner-content">
                    <p className="banner-small">Just In</p>
                    <h1 className="banner-title">
                      Take Your
                      <br />
                      Sound
                      <br />
                      Anywhere
                    </h1>
                    <p className="banner-desc">Top Headphone Brands</p>

                    <button className="banner-btn">Shop</button>
                  </div>

                  <img src={card2} alt="Headphones" className="banner-image" />
                </div>
              </div>
              <h2 className="card-heading">All Products</h2>
            </>
          )}

          {/* PRODUCT LIST */}
          <div className="card">
            {products.length > 0 ? (
              <ul className="product-list-grid">
                {products.map((item) => {
                  const discountedPrice = getDiscountedPrice(item);
                  const originalPrice = getOriginalPrice(item);
                  const hasDiscount = item.discountPercentage > 0;
                  
                  return (
                    <li key={item.id} className="product-item-card">
                      <Link to={`/product/${item.id}`} className="product-link">
                        <div className="card-content-wrapper">
                          <img
                            src={item.thumbnail}
                            className="card-image"
                            alt={item.title}
                          />
                          <p className="title">{item.title}</p>
                          <p className="para-card">
                            {item.description.slice(0, 25)}..
                          </p>
                          <div className="price-section">
                            <p className="price">
                              {hasDiscount ? (
                                <>
                                  <span className="discounted-price">
                                    ₹{discountedPrice.toFixed(2)}
                                  </span>
                                  <span className="original-price">
                                    ₹{originalPrice.toFixed(2)}
                                  </span>
                                </>
                              ) : (
                                <span className="normal-price">
                                  ₹{discountedPrice.toFixed(2)}
                                </span>
                              )}
                            </p>
                            {hasDiscount && (
                              <span className="p-discount">
                                {item.discountPercentage}% Off
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>

                      {/* <button
                        className="addtocart"
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </button> */}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="no-product-wrapper">
                <img src={Img} alt="No product" className="no-product-img" />
                <h1 className="no-product">"Sorry! No Products Found..☹️"</h1>
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="footer">
            <div className="footer-top">
              <div className="footer-col">
                <h3>Store Location</h3>
                <p>500 Terry Francine Street</p>
                <p>San Francisco, CA 94158</p>
                <p>info@mysite.com</p>
                <p>123-456-7890</p>

                <div className="social-icons">
                  <i className="fa-brands fa-facebook"></i>
                  <i className="fa-brands fa-instagram"></i>
                  <i className="fa-brands fa-twitter"></i>
                  <i className="fa-brands fa-youtube"></i>
                </div>
              </div>

              <div className="footer-col">
                <h3>Shop</h3>
                <p>Shop All</p>
                <p>Computers</p>
                <p>Tablets</p>
                <p>Drones & Cameras</p>
                <p>Audio</p>
                <p>Mobile</p>
                <p>T.V & Home Cinema</p>
                <p>Wearable Tech</p>
                <p>Sale</p>
              </div>

              <div className="footer-col">
                <h3>Customer Support</h3>
                <p>Contact Us</p>
                <p>Help Center</p>
                <p>About Us</p>
                <p>Careers</p>
              </div>

              <div className="footer-col">
                <h3>Policy</h3>
                <p>Shipping & Returns</p>
                <p>Terms & Conditions</p>
                <p>Payment Methods</p>
                <p>FAQ</p>
              </div>
            </div>

            <hr className="footer-line" />

            <div className="footer-bottom">
              <p>We accept the following paying methods</p>

              <div className="payment-icons">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                  alt="visa"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
                  alt="mastercard"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/UPI_logo.svg/960px-UPI_logo.svg.png?20240520070249"
                  alt="UPi"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/0/0f/RuPay-Logo.png?20170423140208"
                  alt="rupay"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                  alt="paypal"
                />
              </div>
            </div>
          </div>

          <center>
            <footer className="bottom-footer">
              <p>©️ {year} by Shopify!</p>
            </footer>
          </center>
        </div>
      )}

      {/* MOVE TO TOP BUTTON */}
      {showScrollTop && (
        <button 
          className="scroll-top-btn"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <ChevronUp size={24} />
        </button>
      )}
    </div>
  );
}

export default AddtoCart;