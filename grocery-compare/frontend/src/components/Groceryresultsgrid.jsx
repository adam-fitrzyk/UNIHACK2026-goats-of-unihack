import { useState, useMemo } from "react"
 
// ─── Helpers ────────────────────────────────────────────────────────────────
 
const STORE_STYLES = {
  woolworths: { bg: "#e8f5e9", color: "#2e7d32", label: "Woolworths" },
  coles:      { bg: "#fce4ec", color: "#c62828", label: "Coles" },
  aldi:       { bg: "#e3f2fd", color: "#1565c0", label: "Aldi" },
  iga:        { bg: "#fff3e0", color: "#e65100", label: "IGA" },
}
 
const STOCK_STYLES = {
  in:  { dot: "#4caf50", label: "In stock" },
  low: { dot: "#ff9800", label: "Low stock" },
  out: { dot: "#e53935", label: "Out of stock" },
}
 
function storeStyle(store = "") {
  const key = store.toLowerCase()
  return STORE_STYLES[key] ?? { bg: "#f3f4f6", color: "#374151", label: store }
}
 
function stockStyle(stock = "in") {
  return STOCK_STYLES[stock] ?? STOCK_STYLES.in
}
 
function bestPriceMap(results = []) {
  const map = {}
  results.forEach(({ name, price }) => {
    if (map[name] === undefined || price < map[name]) map[name] = price
  })
  return map
}
 
// ─── Sub-components ──────────────────────────────────────────────────────────
 
function SummaryBar({ visible, total, results }) {
  const avg = results.length
    ? (results.reduce((s, p) => s + p.price, 0) / results.length).toFixed(2)
    : "—"
  const onSale  = results.filter(p => p.was).length
  const maxSave = results.reduce((s, p) => p.was ? Math.max(s, p.was - p.price) : s, 0)
 
  const stats = [
    { label: "Showing",    value: `${visible} of ${total}` },
    { label: "Avg price",  value: results.length ? `$${avg}` : "—" },
    { label: "On sale",    value: onSale },
    { label: "Max saving", value: maxSave > 0 ? `$${maxSave.toFixed(2)}` : "—" },
  ]
 
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
      {stats.map(({ label, value }) => (
        <div key={label} style={{
          flex: "1 1 80px",
          background: "#f8f9fa",
          borderRadius: 10,
          padding: "10px 14px",
        }}>
          <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 2 }}>{label}</div>
          <div style={{ fontSize: 18, fontWeight: 500, color: "#111827" }}>{value}</div>
        </div>
      ))}
    </div>
  )
}
 
function GroceryCard({ item, isBest }) {
  const ss  = storeStyle(item.store)
  const stk = stockStyle(item.stock ?? "in")
  const saving = item.was ? (item.was - item.price).toFixed(2) : null
 
  return (
    <div style={{
      background: "#fff",
      border: isBest ? "2px solid #3b82f6" : "1px solid #e5e7eb",
      borderRadius: 14,
      padding: "14px 16px",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      transition: "border-color 0.15s, box-shadow 0.15s",
      cursor: "default",
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.08)" }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none" }}
    >
      {/* Store badge + best tag */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{
          fontSize: 11, fontWeight: 600, padding: "3px 9px",
          borderRadius: 6, background: ss.bg, color: ss.color,
        }}>
          {ss.label}
        </span>
        {isBest && (
          <span style={{
            fontSize: 10, fontWeight: 600, padding: "2px 8px",
            borderRadius: 6, background: "#dbeafe", color: "#1d4ed8",
          }}>
            Best price
          </span>
        )}
      </div>
 
      {/* Product name */}
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", lineHeight: 1.35 }}>
          {item.name}
        </div>
        {item.sub && (
          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{item.sub}</div>
        )}
      </div>
 
      {/* Price */}
      <div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontSize: 22, fontWeight: 600, color: "#111827" }}>
            ${item.price.toFixed(2)}
          </span>
          {item.was && (
            <span style={{ fontSize: 12, color: "#ef4444", textDecoration: "line-through" }}>
              ${item.was.toFixed(2)}
            </span>
          )}
        </div>
        {item.unit && (
          <div style={{ fontSize: 11, color: "#9ca3af" }}>{item.unit}</div>
        )}
        {saving && (
          <span style={{
            display: "inline-block", marginTop: 5,
            fontSize: 11, fontWeight: 600, padding: "2px 9px",
            borderRadius: 99, background: "#dcfce7", color: "#166534",
          }}>
            Save ${saving}
          </span>
        )}
      </div>
 
      {/* Footer */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderTop: "1px solid #f3f4f6", paddingTop: 8,
        fontSize: 11, color: "#9ca3af",
      }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{
            width: 7, height: 7, borderRadius: "50%",
            background: stk.dot, display: "inline-block",
          }} />
          {stk.label}
        </span>
        {item.cat && <span style={{ textTransform: "capitalize" }}>{item.cat}</span>}
      </div>
    </div>
  )
}
 
// ─── Main export ─────────────────────────────────────────────────────────────
 
/**
 * GroceryResultsGrid
 *
 * Props:
 *   results  – array from res.data.results (your axios response)
 *   query    – string, the search term (for display)
 *
 * Expected shape of each result item:
 * {
 *   name:  string          // e.g. "Full Cream Milk"
 *   store: string          // e.g. "Woolworths" | "Coles" | "Aldi" | "IGA"
 *   price: number          // e.g. 2.40
 *   was?:  number          // original price if on sale
 *   unit?: string          // e.g. "$1.20/L"
 *   sub?:  string          // e.g. "2L"
 *   stock?: "in"|"low"|"out"
 *   cat?:  string          // e.g. "dairy"
 * }
 */
export default function GroceryResultsGrid({ results = [], query = "" }) {
  const [search,  setSearch]  = useState("")
  const [count,   setCount]   = useState(6)
  const [sort,    setSort]    = useState("price-asc")
 
  const best = useMemo(() => bestPriceMap(results), [results])
 
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    let items = results.filter(p =>
      !q ||
      (p.name  ?? "").toLowerCase().includes(q) ||
      (p.store ?? "").toLowerCase().includes(q) ||
      (p.cat   ?? "").toLowerCase().includes(q)
    )
    if (sort === "price-asc")  items = [...items].sort((a, b) => a.price - b.price)
    if (sort === "price-desc") items = [...items].sort((a, b) => b.price - a.price)
    if (sort === "savings")    items = [...items].sort((a, b) =>
      (b.was ? b.was - b.price : 0) - (a.was ? a.was - a.price : 0))
    if (sort === "name")       items = [...items].sort((a, b) => a.name.localeCompare(b.name))
    return items
  }, [results, search, sort])
 
  const visible = filtered.slice(0, count)
 
  if (!results.length) return null
 
  return (
    <div style={{ marginTop: 28, fontFamily: "'system-ui', sans-serif" }}>
 
      {/* Toolbar */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16, alignItems: "center" }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Filter results…"
          style={{
            flex: 1, minWidth: 140, padding: "8px 12px",
            fontSize: 14, borderRadius: 8, border: "1px solid #e5e7eb",
            outline: "none",
          }}
        />
 
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#6b7280", whiteSpace: "nowrap" }}>
          Show
          <input
            type="range" min={1} max={Math.max(results.length, 1)} value={count} step={1}
            onChange={e => setCount(Number(e.target.value))}
            style={{ width: 72 }}
          />
          <span style={{ fontWeight: 600, color: "#111827", minWidth: 18 }}>{count}</span>
        </div>
 
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          style={{
            fontSize: 13, padding: "7px 10px",
            borderRadius: 8, border: "1px solid #e5e7eb",
            background: "#fff", color: "#374151", cursor: "pointer",
          }}
        >
          <option value="price-asc">Price: low–high</option>
          <option value="price-desc">Price: high–low</option>
          <option value="savings">Best savings</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>
 
      {/* Summary */}
      <SummaryBar visible={visible.length} total={filtered.length} results={filtered} />
 
      {/* Grid */}
      {visible.length === 0 ? (
        <p style={{ color: "#9ca3af", fontSize: 14, textAlign: "center", padding: "2rem 0" }}>
          No results match your filter.
        </p>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
          gap: 12,
        }}>
          {visible.map((item, i) => (
            <GroceryCard
              key={`${item.store}-${item.name}-${i}`}
              item={item}
              isBest={item.price === best[item.name]}
            />
          ))}
        </div>
      )}
    </div>
  )
}