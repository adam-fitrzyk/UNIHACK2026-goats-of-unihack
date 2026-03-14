import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"; // Import it here
import axios from "axios";
import "./App.css";
import GroceryResultsGrid from "./components/Groceryresultsgrid"

export default function App() {
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
  const [query, setQuery] = useState("");
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
          {/* Pass all your search-related state here! */}
          <Route 
            path="/" 
            element={
              <HomePage 
                query={query} 
                setQuery={setQuery} 
                handleSearch={handleSearch} 
                results={results} 
                loading={loading} 
              />
            } 
          />
          
          <Route path="/cart" element={<CartPage />} />
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