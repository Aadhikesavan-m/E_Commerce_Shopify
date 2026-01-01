import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          confirm
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("Registered successfully");
      navigate("/login");
    } catch (err) {
      alert(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="register-form" onSubmit={handleRegister}>
      <h1>Register</h1>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
      />

      <button disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>

      <p>
        Already registered? <Link to="/login">Login</Link>
      </p>
    </form>
  );
}

export default Register;
