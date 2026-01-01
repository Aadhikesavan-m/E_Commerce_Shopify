import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import AddtoCart from "./AddtoCart";
import CartPage from "./CartElement";
import UnknownFile from "./UnknownFile";
import ProductPage from "./ProductPage";
import Login from "./Login";
import Register from "./Register";
function ForgotPassword() {
  return (
    <>
      <div>
        <h2 style={{ border: "2px solid grey", padding: "40px" }}>
          Sorry! You can't update your Password right Now☹️
        </h2>
        <Link to={"/login"}>Do you wanna return to Login Page</Link>
      </div>
    </>
  );
}

function App() {
  const [cart, setCart] = useState([]);
  const [users, setUsers] = useState([]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<AddtoCart cart={cart} setCart={setCart} users={users} setUsers ={setUsers}/>}
        />

        <Route
          path="/product/:id"
          element={<ProductPage cart={cart} setCart={setCart} />}
        />

        <Route
          path="/cart"
          element={<CartPage cart={cart} setCart={setCart} />}
        />
        <Route path="/login" element={<Login users={users} />} />
        <Route
          path="/register"
          element={<Register users={users} setUsers={setUsers} />}
        />
        <Route path="/forgot" element={<ForgotPassword />} />

        <Route path="*" element={<UnknownFile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
