import React from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Check } from "lucide-react";
import CustomAlert from "./CustomAlert";
import useAlert from "./useAlert";
import "./cart.css";

const PLACEHOLDER = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect fill='%23f8fafc' width='600' height='400'/%3E%3Cpath fill='%23e2e8f0' d='M0 0h600v400H0z'/%3E%3Ctext x='50%25' y='50%25' font-family='system-ui' font-size='16' fill='%2394a3b8' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";

function CartPage({ cart, setCart }) {
  const navigate = useNavigate();
  const [showCheckoutSuccess, setShowCheckoutSuccess] = React.useState(false);

  const { alertState, showAlert, hideAlert, confirm } = useAlert();

  const increaseQty = (id) => {
    setCart(cart.map((item) =>
      item.id === id ? { ...item, qty: item.qty + 1 } : item
    ));
  };

  const decreaseQty = (id) => {
    setCart(cart.map((item) =>
      item.id === id && item.qty > 1 
        ? { ...item, qty: item.qty - 1 } 
        : item
    ));
  };

  const removeItem = (id) => {
    const item = cart.find(item => item.id === id);
    showAlert({
      title: "Remove Item",
      message: `Are you sure you want to remove "${item?.title || 'this item'}" from your cart?`,
      type: "warning",
      showCancel: true,
      onConfirm: () => {
        setCart(cart.filter((item) => item.id !== id));
        // Optional: Show success message
        showAlert({
          title: "Removed",
          message: "Item has been removed from your cart.",
          type: "success",
          showCancel: false
        });
      }
    });
  };

    const clearCart = () => {
    if (cart.length === 0) return;
    
    showAlert({
      title: "Clear Cart",
      message: "Are you sure you want to clear your entire cart?",
      type: "error",
      showCancel: true,
      onConfirm: () => {
        setCart([]);
        showAlert({
          title: "Cart Cleared",
          message: "All items have been removed from your cart.",
          type: "success",
          showCancel: false
        });
      }
    });
  };

  const handleCheckout = () => {
    showAlert({
      title: "Proceed to Checkout",
      message: `Confirm purchase for ₹${grandTotal.toFixed(2)}?`,
      type: "info",
      showCancel: true,
      onConfirm: () => {
        setShowCheckoutSuccess(true);
        setTimeout(() => {
          setShowCheckoutSuccess(false);
          setCart([]);
          navigate("/");
        }, 2000);
      }
    });
  };

  // Calculate price in INR - use stored priceInINR or calculate it
  const getPriceInINR = (item) => {
    // If priceInINR is already stored (from ProductPage), use it
    if (item.priceInINR !== undefined) {
      return item.priceInINR;
    }
    // Otherwise calculate it (for backward compatibility)
    return (item.price ?? 0) * 10;
  };

  const getOriginalPriceInINR = (item) => {
    // If originalPriceInINR is already stored (from ProductPage), use it
    if (item.originalPriceInINR !== undefined) {
      return item.originalPriceInINR;
    }
    // Otherwise calculate it
    const priceInINR = getPriceInINR(item);
    if (item.discountPercentage) {
      return priceInINR / (1 - item.discountPercentage / 100);
    }
    return priceInINR;
  };

  const total = cart.reduce(
    (sum, item) => sum + getPriceInINR(item) * item.qty,
    0
  );

  const shipping = total > 500 ? 0 : 49;
  const tax = total * 0.18;
  const grandTotal = total + shipping + tax;

  const getImage = (item) =>
    item?.thumbnail || item?.image || item?.images?.[0] || PLACEHOLDER;

  const getTitle = (item) => item.title || item.name || "Untitled Product";

  if (showCheckoutSuccess) {
    return (
      <div className="checkout-success-container">
        <div className="checkmark-circle">
          <Check size={48} />
        </div>
        <h2>Order Confirmed!</h2>
        <p>Thank you for your purchase. You will receive a confirmation email shortly.</p>
        <button className="continue-shopping-btn" onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
       <CustomAlert
        isOpen={alertState.isOpen}
        onClose={hideAlert}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        showConfirm={true}
        confirmText="Confirm"
        onConfirm={confirm}
        showCancel={alertState.showCancel}
        cancelText="Cancel"
        onCancel={hideAlert}
      />
      <header className="cart-header">
        <button className="back-button" onClick={() => navigate("/")}>
          <ArrowLeft size={20} />
          Continue Shopping
        </button>
        <h1 className="cart-title">
          <ShoppingBag size={28} />
          Shopping Cart
        </h1>
        {cart.length > 0 && (
          <button className="clear-cart-btn" onClick={clearCart}>
            <Trash2 size={18} />
            Clear Cart
          </button>
        )}
      </header>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">
            <ShoppingBag size={64} />
          </div>
          <h2>Your cart is empty</h2>
          <p>Add some amazing products to get started!</p>
          <button className="shop-now-btn" onClick={() => navigate("/")}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-section">
            <div className="cart-items-header">
              <h2>Items ({cart.length})</h2>
              <span className="item-count">Total: ₹{total.toFixed(2)}</span>
            </div>
            
            <div className="cart-items-list">
              {cart.map((item) => {
                const itemPrice = getPriceInINR(item);
                const itemOriginalPrice = getOriginalPriceInINR(item);
                const hasDiscount = itemOriginalPrice > itemPrice;
                
                return (
                  <div key={item.id} className="cart-item-card">
                    <div className="item-image-container">
                      <img 
                        src={getImage(item)} 
                        alt={getTitle(item)} 
                        className="item-image"
                        onError={(e) => {
                          e.target.src = PLACEHOLDER;
                          e.target.onerror = null;
                        }}
                      />
                      <div className="item-badge">
                        {hasDiscount && (
                          <span className="discount-badge">
                            -{Math.round(((itemOriginalPrice - itemPrice) / itemOriginalPrice) * 100)}%
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="item-details">
                      <div className="item-header">
                        <h3 className="item-title">{getTitle(item)}</h3>
                        <button 
                          className="remove-item-btn"
                          onClick={() => removeItem(item.id)}
                          aria-label="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      
                      <p className="item-brand">{item.brand || "Generic Brand"}</p>
                      
                      <div className="item-price-section">
                        <span className="item-price">
                          ₹{itemPrice.toFixed(2)}
                        </span>
                        {hasDiscount && (
                          <span className="item-original-price">
                            ₹{itemOriginalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <div className="item-actions">
                        <div className="quantity-controls">
                          <button 
                            className="qty-btn"
                            onClick={() => decreaseQty(item.id)}
                            disabled={item.qty <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="quantity-display">{item.qty}</span>
                          <button 
                            className="qty-btn"
                            onClick={() => increaseQty(item.id)}
                            aria-label="Increase quantity"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        <div className="item-subtotal">
                          <span className="subtotal-label">Subtotal:</span>
                          <span className="subtotal-amount">
                            ₹{(itemPrice * item.qty).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="order-summary">
            <div className="summary-card">
              <h2 className="summary-title">Order Summary</h2>
              
              <div className="summary-row">
                <span>Subtotal ({cart.length} items)</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span className={shipping === 0 ? "free-shipping" : ""}>
                  {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
                </span>
              </div>
              
              <div className="summary-row">
                <span>Tax (18%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total-row">
                <span>Total Amount</span>
                <span className="grand-total">₹{grandTotal.toFixed(2)}</span>
              </div>
              
              {shipping > 0 && total < 500 && (
                <div className="shipping-notice">
                  Add ₹{(500 - total).toFixed(2)} more for FREE shipping
                </div>
              )}
              
              <button 
                className="checkout-btn"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
              
              <div className="payment-options">
                <p className="secure-payment">
                  🔒 Secure Payment · 256-bit SSL Encrypted
                </p>
                <div className="payment-icons">
                  <span>💳</span>
                  <span>📱</span>
                  <span>🏦</span>
                  <span>🪙</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;