import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="nav">
      {/* KHỐI TRÁI: LOGO (Giữ nguyên) */}
      <div className="nav__left">
        <div className="nav__logo">
          Urban<span>Sphere</span>
        </div>
      </div>

      {/* KHỐI GIỮA: LINKS (Giữ nguyên) */}
      <div className="nav__center">
        <a>Platform</a>
        <a>Solutions</a>
        <a>Use Cases</a>
        <a>Docs</a>
      </div>

      {/* KHỐI PHẢI: BUTTON + TOGGLE */}
      <div className="nav__right">
        {/* Nút Sign In (Desktop) */}
        <Link to="/login" className="nav__cta">
          Sign In
        </Link>

        {/* NÚT 3 GẠCH (Mới thêm - Sẽ ẩn trên Desktop bằng CSS) */}
        <button 
          className="nav__toggle" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* MENU MOBILE (Mới thêm - Sẽ ẩn trên Desktop bằng CSS) */}
      <div className={`nav__mobile-menu ${isOpen ? "open" : ""}`}>
        <a>Platform</a>
        <a>Solutions</a>
        <a>Use Cases</a>
        <a>Docs</a>
        <Link to="/login" className="mobile-cta">Sign In</Link>
      </div>
    </nav>
  );
}