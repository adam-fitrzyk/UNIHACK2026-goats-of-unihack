import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"; // Import it here
import axios from "axios";
import "./App.css";
import GroceryResultsGrid from "./components/Groceryresultsgrid"

export default function App() {
  const [query, setQuery] = useState("");
  //const [results, setResults] = useState(null);
  //const [loading, setLoading] = useState(false);
  //const [query, setQuery] = useState("")
  //const [results, setResults] = useState(null)
  const mockResults = {
    query: "milk",
    results: [
      { name: "Full Cream Milk", store: "Woolworths", price: 2.40, was: 3.20, unit: "$1.20/L", sub: "2L", stock: "in", cat: "dairy" },
      { name: "Full Cream Milk", store: "Coles",      price: 2.50, was: null, unit: "$1.25/L", sub: "2L", stock: "in", cat: "dairy" },
      { name: "Full Cream Milk", store: "Aldi",       price: 1.99, was: null, unit: "$0.99/L", sub: "2L", stock: "low", cat: "dairy" },
      { name: "Full Cream Milk", store: "IGA",        price: 3.10, was: null, unit: "$1.55/L", sub: "2L", stock: "out", cat: "dairy" },
    ]
  }

  const [results, setResults] = useState(mockResults)

  const [loading, setLoading] = useState(false)

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
        <Link to="/cards" style={{ marginRight: '20px' }}>** Cards</Link>
      </div>

      <div className="cart-icon">
        <Link to="/cart">🛒 Cart (0)</Link>
      </div>
    </nav>
  );
}

function HomePage({ query, setQuery, handleSearch, results, loading }) {
  return (
    <div style={{ maxWidth: 600, margin: "60px auto", fontFamily: "sans-serif", padding: "0 20px" }}>
      <h1>🛒 Grocery Price Compare</h1>
      <form onSubmit={handleSearch} style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search for a product e.g. milk"
          style={{ flex: 1, padding: "10px 14px", fontSize: 16, borderRadius: 8, border: "1px solid #ccc" }}
        />
        <button
          type="submit"
          style={{ padding: "10px 20px", fontSize: 16, borderRadius: 8, background: "#2563eb", color: "white", border: "none", cursor: "pointer" }}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>


      {results && (
        <div>
          <GroceryResultsGrid results={results.results} query={results.query} />
        </div>
      )}
    </div>
  );
}

function CartPage() {
  return (
    <div class="cart-page">
      <h1>Your Shopping Cart</h1>

      <div class="cart-layout">
        <div class="cart-items">
          <div class="cart-item">
            <div class="temp"></div>
            <div class="item-main">
              <h3>Tomatoes Gourmet approx. 130g</h3>
              <div class="quantity-controls">
                <button>-</button> <span>1</span> <button>+</button>
              </div>
            </div>
            <div class="price-side">
              <div class="price-box winner">
                <span class="store-label">Coles</span>
                <span class="main-price">$0.90</span>
              </div>
              <div class="price-box loser">
                <span class="store-label">Woolworths</span>
                <span class="sub-price">$3.30</span>
              </div>
            </div>
          </div>

          <div class="cart-item">
            <div class="temp"></div>
            <div class="item-main">
              <h3>Tomatoes Gourmet approx. 130g</h3>
              <div class="quantity-controls">
                <button>-</button> <span>1</span> <button>+</button>
              </div>
            </div>
            <div class="price-side">
              <div class="price-box winner">
                <span class="store-label">Coles</span>
                <span class="main-price">$0.90</span>
              </div>
              <div class="price-box loser">
                <span class="store-label">Woolworths</span>
                <span class="sub-price">$3.30</span>
              </div>
            </div>
          </div>

          <div class="cart-item">
            <div class="temp"></div>
            <div class="item-main">
              <h3>Tomatoes Gourmet approx. 130g</h3>
              <div class="quantity-controls">
                <button>-</button> <span>1</span> <button>+</button>
              </div>
            </div>
            <div class="price-side">
              <div class="price-box loser">
                <span class="store-label">Coles</span>
                <span class="main-price">$10000.90</span>
              </div>
              <div class="price-box winner">
                <span class="store-label">Woolworths</span>
                <span class="sub-price">$3.30</span>
              </div>
            </div>
          </div>



        </div>

        <div class="cart-summary">
          <h3>Order Summary</h3>
          <div class="summary-line"><span>Total Price:</span> <strong>$15.50</strong></div>
          <div class="summary-line savings"><span>Total Savings:</span> <strong>$11.70</strong></div>
          <button class="checkout-btn">Checkout (Open Links)</button>
        </div>
      </div>
    </div>
  );
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