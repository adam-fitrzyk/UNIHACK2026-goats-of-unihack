import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"; // Import it here
import axios from "axios";
import "./App.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/search?q=${encodeURIComponent(query)}`);
      setResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/cards" element={<ComparePrices />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">GroCom</Link>
      </div>
      
      {/* Grouping links together */}
      <div className="nav-links">
        <Link to="/cards" style={{ marginRight: '20px' }}>Cards</Link>
      </div>

      <div className="cart-icon">
        <Link to="/cart">🛒 Cart (0)</Link>
      </div>
    </nav>
  );
}

function HomePage({ query, setQuery, handleSearch, results, loading }) {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>🛒 Grocom</h1>
        <p className="subtitle">Compare the cheapest groceries. Anytime. Anywhere.</p>
        
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search for a product e.g. milk"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </div>

      {results && (
        <div className="results-section">
          <p>Results for: <strong>{results.query}</strong></p>
          {/* Your results display logic here */}
        </div>
      )}
    </div>
  );
}

function CartPage() {
  return <div className="page-container"><h1>This is the Cart Page</h1></div>;
}

function ComparePrices() {
  return (
    <main>
      <div class="card-container">
        <div class="product-card">
          <div class="temp"></div>
          <h2>Muscle Nation Protein Water Mango Passionfruit 300g</h2>
          
          <div class="price-grid">
            <div class="store-info">
              <span class="store-name coles">Coles</span>
              <span class="price">$17.50</span>
              <span class="unit-price">$5.83 / 100g</span>
            </div>
            <div class="store-info">
              <span class="store-name woolies">Woolies</span>
              <span class="price">$35.00</span>
              <span class="unit-price">$11.67 / 100g</span>
            </div>
          </div>

          <div class="discount-badge">-$17.50</div>
          <button class="add-btn">Add to Cart</button>
        </div>

      </div>
    </main>
  );
}