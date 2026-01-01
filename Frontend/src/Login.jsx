import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("token", data.token);
      localStorage.setItem("userData", JSON.stringify(data.user));

      alert("Login successful");
      navigate("/");
    } catch (err) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h1>Login</h1>

      <input
        placeholder="Email or Username"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      <p>
        New user? <Link to="/register">Register</Link>
      </p>
    </form>
  );
}

export default Login;
