import { useState, useMemo } from "react"
import {
  Button, Box, Card, CardContent, Chip, Typography, TextField,
  Slider, Select, MenuItem, FormControl, InputLabel, Grid, Paper
} from "@mui/material"

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STORE_COLORS = {
  woolworths: { bg: "#e8f5e9", color: "#2e7d32" },
  coles:      { bg: "#fce4ec", color: "#c62828" },
  aldi:       { bg: "#e3f2fd", color: "#1565c0" },
  iga:        { bg: "#fff3e0", color: "#e65100" },
}

const STOCK = {
  in:  { dot: "#4caf50", label: "In stock" },
  low: { dot: "#ff9800", label: "Low stock" },
  out: { dot: "#e53935", label: "Out of stock" },
}

function storeColor(store = "") {
  return STORE_COLORS[store.toLowerCase()] ?? { bg: "#f3f4f6", color: "#374151" }
}

function bestPriceMap(results = []) {
  return results.reduce((map, { name, price }) => {
    if (map[name] === undefined || price < map[name]) map[name] = price
    return map
  }, {})
}

// ─── Summary Bar ─────────────────────────────────────────────────────────────

function SummaryBar({ visible, total, results }) {
  const avg     = results.length ? (results.reduce((s, p) => s + p.price, 0) / results.length).toFixed(2) : null
  const onSale  = results.filter(p => p.was).length
  const maxSave = results.reduce((s, p) => p.was ? Math.max(s, p.was - p.price) : s, 0)

  const stats = [
    { label: "Showing",    value: `${visible} of ${total}` },
    { label: "Avg price",  value: avg ? `$${avg}` : "—" },
    { label: "On sale",    value: onSale },
    { label: "Max saving", value: maxSave > 0 ? `$${maxSave.toFixed(2)}` : "—" },
  ]

  return (
    <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
      {stats.map(({ label, value }) => (
        <Grid size={{ xs: 6, sm: 3 }} key={label}>
          <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" display="block">{label}</Typography>
            <Typography variant="h6" fontWeight={500}>{value}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  )
}

// ─── Single Card ─────────────────────────────────────────────────────────────

function GroceryCard({ item, isBest }) {
  const sc  = storeColor(item.store)
  const stk = STOCK[item.stock ?? "in"] ?? STOCK.in
  const saving = item.was ? (item.was - item.price).toFixed(2) : null

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        borderWidth: isBest ? 2 : 1,
        borderColor: isBest ? "primary.main" : "divider",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.15s",
        "&:hover": { boxShadow: 3 },
      }}
    >
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1.25, height: "100%" }}>

        {/* Store badge + best tag */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Chip
            label={item.store}
            size="small"
            sx={{ fontSize: 11, fontWeight: 600, bgcolor: sc.bg, color: sc.color, borderRadius: 1.5 }}
          />
          {isBest && (
            <Chip label="Best price" size="small" color="primary" variant="outlined" sx={{ fontSize: 10, height: 20 }} />
          )}
        </Box>

        {/* Product name + sub */}
        <Box>
          <Typography variant="body2" fontWeight={600} lineHeight={1.35}>{item.name}</Typography>
          {item.sub && (
            <Typography variant="caption" color="text.secondary">{item.sub}</Typography>
          )}
        </Box>

        {/* Price */}
        <Box>
          <Box display="flex" alignItems="baseline" gap={0.75}>
            <Typography variant="h5" fontWeight={600}>${item.price.toFixed(2)}</Typography>
            {item.was && (
              <Typography variant="caption" color="error" sx={{ textDecoration: "line-through" }}>
                ${item.was.toFixed(2)}
              </Typography>
            )}
          </Box>
          {item.unit && (
            <Typography variant="caption" color="text.secondary">{item.unit}</Typography>
          )}
          {saving && (
            <Chip
              label={`Save $${saving}`}
              size="small"
              sx={{ mt: 0.75, fontSize: 11, bgcolor: "#dcfce7", color: "#166534", borderRadius: 99 }}
            />
          )}
        </Box>

        <Button 
          variant="contained" 
          size="small" 
          fullWidth
          className="add-to-cart-btn"
          onClick={() => console.log("Added to cart:", item.name)}
        >
          Add to Cart
        </Button>

        {/* Footer */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: "auto", pt: 1.25, borderTop: "1px solid", borderColor: "divider" }}
        >
          <Box display="flex" alignItems="center" gap={0.75}>
            <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: stk.dot }} />
            <Typography variant="caption" color="text.secondary">{stk.label}</Typography>
          </Box>
          {item.cat && (
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: "capitalize" }}>
              {item.cat}
            </Typography>
          )}
        </Box>

      </CardContent>
    </Card>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function GroceryResultsGrid({ results = [], query = "" }) {
  const [search, setSearch] = useState("")
  const [count,  setCount]  = useState(6)
  const [sort,   setSort]   = useState("price-asc")

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
    if (sort === "savings")    items = [...items].sort((a, b) => (b.was ? b.was - b.price : 0) - (a.was ? a.was - a.price : 0))
    if (sort === "name")       items = [...items].sort((a, b) => a.name.localeCompare(b.name))
    return items
  }, [results, search, sort])

  const visible = filtered.slice(0, count)

  if (!results.length) return null

  return (
    <Box sx={{ mt: 3.5 }}>

      {/* Toolbar */}
      <Box display="flex" gap={1.5} flexWrap="wrap" alignItems="center" sx={{ mb: 2 }}>
        {/*<TextField
          size="small"
          placeholder="Filter results…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ flex: 1, minWidth: 140 }}
        />

        <Box display="flex" alignItems="center" gap={1} sx={{ minWidth: 160 }}>
          <Typography variant="caption" color="text.secondary" whiteSpace="nowrap">
            Show {count}
          </Typography>
          <Slider
            size="small"
            min={1}
            max={Math.max(results.length, 1)}
            value={count}
            onChange={(_, v) => setCount(v)}
            sx={{ width: 80 }}
          />
        </Box>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Sort by</InputLabel>
          <Select value={sort} label="Sort by" onChange={e => setSort(e.target.value)}>
            <MenuItem value="price-asc">Price: low–high</MenuItem>
            <MenuItem value="price-desc">Price: high–low</MenuItem>
            <MenuItem value="savings">Best savings</MenuItem>
            <MenuItem value="name">Name A–Z</MenuItem>
          </Select>
        </FormControl>*/}
      </Box>

      {/* Summary */}
      <SummaryBar visible={visible.length} total={filtered.length} results={filtered} />

      {/* Grid */}
      {visible.length === 0 ? (
        <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
          No results match your filter.
        </Typography>
      ) : (
        <Grid container spacing={1.5}>
          {visible.map((item, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={`${item.store}-${item.name}-${i}`}>
              <GroceryCard item={item} isBest={item.price === best[item.name]} />
            </Grid>
          ))}
        </Grid>
      )}

    </Box>
  )
}