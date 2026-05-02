import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import "./style.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Reviews from "./pages/Reviews";
import Contact from "./pages/Contact";

import Home from "./pages/Home";
import Burger from "./pages/Burger";
import Coffee from "./pages/Coffee";
import Sandwich from "./pages/Sandwich";
import Juice from "./pages/Juice";
import Tea from "./pages/Tea";
import Shawarma from "./pages/Shawarma";
import { CartProvider } from "./context/CartContext";
import IceCream from "./pages/IceCream";
import Milkshake from "./pages/MilkShake";


import SideCart from "./components/SideCart";

// ✅ Scroll to top component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />  {/* ✅ Scroll to top on every page change */}
        <Navbar />
        <SideCart />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/about" element={<About />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/coffee" element={<Coffee />} />
          <Route path="/burger" element={<Burger />} />
          <Route path="/juice" element={<Juice />} />
          <Route path="/icecream" element={<IceCream />} />
          <Route path="/tea" element={<Tea />} />
          <Route path="/milkshake" element={<Milkshake />} />
          <Route path="/sandwich" element={<Sandwich />} />
          <Route path="/shawarma" element={<Shawarma />} />
        </Routes>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;