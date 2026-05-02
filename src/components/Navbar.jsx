import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../style.css";

function Navbar() {
  const { setIsCartOpen, cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cart.reduce((total, item) => total + item.qty, 0);
  const handleGoBack = () => navigate(-1);
  const isHomePage = location.pathname === "/";

  return (
    <ul className="navbar">
      {/* ✅ Back Button - LEFT CORNER */}
      <li style={{ order: -1 }}>
        {!isHomePage && (
          <button onClick={handleGoBack} className="nav-back-btn" title="Go Back">
            ← BACK
          </button>
        )}
      </li>

      {/* ✅ Navigation Links - CENTER */}
      <div className="nav-links-container" style={{ display: 'flex', gap: '40px' }}>
        <li><Link to="/">HOME</Link></li>
        <li><Link to="/menu">MENU</Link></li>
        <li><Link to="/about">ABOUT</Link></li>
        <li><Link to="/reviews">REVIEWS</Link></li>
        <li><Link to="/contact">CONTACT</Link></li>
      </div>

      {/* ✅ Cart Icon - RIGHT CORNER */}
      <li style={{ order: 1 }}>
        <div onClick={() => setIsCartOpen(true)} className="cart-icon-wrapper" style={{ cursor: 'pointer' }}>
          <img src="/images/cart.png" alt="cart" className="cart-icon" />
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </div>
      </li>
    </ul>
  );
}

export default Navbar;