import React from "react";
import "./cart.css";
import { useNavigate } from "react-router-dom";

// fallback image in case product has no thumbnail
const PLACEHOLDER =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect fill='%23eee' width='600' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-family='Arial' font-size='20'%3ENo Image%3C/text%3E%3C/svg%3E";

function CartPage({ cart, setCart }) {
  const navigate = useNavigate();

  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? { ...item, qty: item.qty > 1 ? item.qty - 1 : 1 }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const total = cart.reduce(
    (sum, item) => sum + (item.price ?? item.retailPrice ?? 0) * item.qty,
    0
  );

  const getImage = (item) =>
    item?.thumbnail || item?.image || item?.images?.[0] || PLACEHOLDER;

  const getTitle = (item) => item.title || item.name || "Untitled Product";

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>

      {cart.length === 0 ? (
        <>
          <h3 className="empty">Your cart is empty 🛒</h3>
          <div className="full-center">
            <button className="go-purchase-btn" onClick={() => navigate("/")}>
              Go to Purchase
            </button>
          </div>
        </>
      ) : (
        <>
          <ul className="cart-list">
            {cart.map((item) => (
              <li key={item.id} className="cart-item">
                <img src={getImage(item)} alt={getTitle(item)} className="cart-img" />

                <div className="cart-info">
                  <h3>{getTitle(item)}</h3>
                  <p>₹ {item.price ?? item.retailPrice ?? "N/A"}</p>

                  <div className="qty-box">
                    <button onClick={() => decreaseQty(item.id)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => increaseQty(item.id)}>+</button>
                  </div>

                  <button
                    className="remove"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="total-box">
            <center>
              <h2>Total: ₹{total.toFixed(2)}</h2>
              <button className="checkout">Checkout</button>
            </center>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;
