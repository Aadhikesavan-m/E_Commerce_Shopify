import { Link } from "react-router-dom";
import "./UserModal.css";

const UserModal = ({ user, onClose, onLogout }) => {
  const avatarLetter = user?.username?.charAt(0).toUpperCase() || "👤";

  return (
    <div className="user-modal-popover">
      <button className="close-btn" onClick={onClose}>✕</button>

      {/* AVATAR */}
      <div className="user-avatar">
        {avatarLetter}
      </div>

      {user ? (
        <>
          <h4 className="username">{user.username}</h4>
          <p className="email">{user.email}</p>

          <div className="user-meta">
            <span className="status online">● Online</span>
          </div>

          <hr />

          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </>
      ) : (
        <>
          <p className="not-logged-text">You are not logged in</p>

          <Link to="/login" className="login-btn" onClick={onClose}>
            Login
          </Link>
        </>
      )}
    </div>
  );
};

export default UserModal;
