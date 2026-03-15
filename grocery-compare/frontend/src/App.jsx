import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import "./App.css";
import GroceryResultsGrid from "./components/Groceryresultsgrid";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

console.log("API URL:", import.meta.env.VITE_API_URL)

export default function App() {
  const mockResults = {
    query: "milk",
    results: [
      { name: "Full Cream Milk", store: "Woolworths", price: 2.40, was: 3.20, unit: "$1.20/L", sub: "2L", stock: "in",  cat: "dairy", url: "https://www.woolworths.com.au/shop/productdetails/888137/woolworths-full-cream-milk" },
      { name: "Full Cream Milk", store: "Coles",      price: 2.50, was: null, unit: "$1.25/L", sub: "2L", stock: "in",  cat: "dairy", url: "https://www.coles.com.au/product/coles-full-cream-milk-2l-439693" },
      { name: "Full Cream Milk", store: "Aldi",       price: 1.99, was: null, unit: "$0.99/L", sub: "2L", stock: "low", cat: "dairy", url: "https://www.aldi.com.au/product/farmdale-full-cream-milk-2l-000000000000398689" },
      { name: "Full Cream Milk", store: "IGA",        price: 3.10, was: null, unit: "$1.55/L", sub: "2L", stock: "out", cat: "dairy", url: "https://www.igashop.com.au/product/pauls-zymil-full-cream-milk-88804" },
    ]
  };

  const [query,     setQuery]     = useState("");
  const [results,   setResults]   = useState(mockResults);
  const [loading,   setLoading]   = useState(false);
  const [cartItems, setCartItems] = useState([]);

  function handleToggleCart(item) {
    if (!item.url) return;
    setCartItems(prev =>
      prev.some(i => i.url === item.url)
        ? prev.filter(i => i.url !== item.url)
        : [...prev, item]
    );
  }

  function handleRemoveFromCart(url) {
    setCartItems(prev => prev.filter(i => i.url !== url));
  }

  function handleClearCart() {
    setCartItems([]);
  }

async function handleSearch(e) {
  e.preventDefault();
  if (!query.trim()) return;
  setLoading(true);
  try {
    const res = await api.get(`/search/${encodeURIComponent(query)}`);
    setResults({
      query,
      results: res.data  // ← pass directly, no mapping needed
    });
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
}

  const basename = import.meta.env.MODE === "production"
    ? "/UNIHACK2026-goats-of-unihack"
    : "";

  return (
    <div>
      <BrowserRouter basename={basename}>
        <Navbar cartCount={cartItems.length} />
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                query={query}
                setQuery={setQuery}
                handleSearch={handleSearch}
                results={results}
                loading={loading}
                cartItems={cartItems}
                onToggleCart={handleToggleCart}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <CartPage
                cartItems={cartItems}
                onRemove={handleRemoveFromCart}
                onClear={handleClearCart}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

function Navbar({ cartCount }) {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">GroCom</Link>
      </div>
      <div className="cart-icon">
        <Link to="/cart">🛒 Cart ({cartCount})</Link>
      </div>
    </nav>
  );
}

function HomePage({ query, setQuery, handleSearch, results, loading, cartItems, onToggleCart }) {
  return (
    <div style={{ maxWidth: 600, margin: "60px auto", fontFamily: "sans-serif", padding: "0 20px" }}>
      <h1>🛒 Grocery Price Compare</h1>
      <form className="search-container" onSubmit={handleSearch} style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search for a product e.g. milk"
          className="search-input"
        />
        <button type="submit" className="search-button">
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {results && (
        <div>
          <GroceryResultsGrid
            results={results.results}
            query={results.query}
            cartItems={cartItems}
            onToggleCart={onToggleCart}
          />
        </div>
      )}
    </div>
  );
}

function CartPage({ cartItems, onRemove, onClear }) {
  const total    = cartItems.reduce((s, i) => s + i.price, 0);
  const savings  = cartItems.reduce((s, i) => s + (i.was ? i.was - i.price : 0), 0);

  function handleCheckout() {
    cartItems.forEach((item, idx) => {
      setTimeout(() => window.open(item.url, "_blank"), idx * 150);
    });
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <h1>Your Shopping Cart</h1>
        <p style={{ color: "#9ca3af", marginTop: 32, textAlign: "center" }}>
          No items in cart — go search for something!
        </p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Shopping Cart</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map(item => (
            <div className="cart-item" key={item.url}>
              <div className="temp"></div>
              <div className="item-main">
                <h3>{item.name}</h3>
                {item.sub && <span style={{ fontSize: 13, color: "#9ca3af" }}>{item.sub}</span>}
                <button
                  onClick={() => onRemove(item.url)}
                  style={{
                    marginTop: 8, fontSize: 12, color: "#ef4444",
                    background: "none", border: "none", cursor: "pointer", padding: 0,
                  }}
                >
                  Remove
                </button>
              </div>
              <div className="price-side">
                <div className="price-box winner">
                  <span className="store-label">{item.store}</span>
                  <span className="main-price">${item.price.toFixed(2)}</span>
                </div>
                {item.was && (
                  <div className="price-box loser">
                    <span className="store-label">Was</span>
                    <span className="sub-price">${item.was.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-line">
            <span>Total Price:</span> <strong>${total.toFixed(2)}</strong>
          </div>
          {savings > 0 && (
            <div className="summary-line savings">
              <span>Total Savings:</span> <strong>${savings.toFixed(2)}</strong>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
            {cartItems.map(item => (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block", fontSize: 13, padding: "8px 12px",
                  background: "#f0fdf4", border: "1px solid #bbf7d0",
                  borderRadius: 8, color: "#166534", textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Open {item.store} →
              </a>
            ))}
          </div>
          <button className="checkout-btn" onClick={onClear} style={{ marginTop: 12 }}>
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}