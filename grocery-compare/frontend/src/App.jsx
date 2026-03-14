
import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"; // Import it here
import axios from "axios";
import "./App.css";

// 1. MAIN APP: The "Brain" (handles data/logic)
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
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

// 2. NAVBAR: The "Navigation" (handles the layout)
function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">GroCom</div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/test">Test</Link>
      </div>
      <div className="cart-icon">🛒 Cart (0)</div>
    </nav>
  );
}

// 3. HOMEPAGE: The "View" (handles inputs/results)
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
        <div style={{ marginTop: 32 }}>
          <p>Results for: <strong>{results.query}</strong></p>
          {results.results.length === 0
            ? <p style={{ color: "#888" }}>No results yet — scrapers not built yet.</p>
            : <pre>{JSON.stringify(results.results, null, 2)}</pre>
          }
        </div>
      )}
    </div>
  );
}

// 4. TESTPAGE
function TestPage() {
  return <div className="page-container"><h1>This is the Test Page</h1></div>;
}