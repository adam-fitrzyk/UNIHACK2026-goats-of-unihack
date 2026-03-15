import { useState, useMemo, useEffect } from "react"
import {
  Button, Box, Card, CardContent, Chip, Typography,
  Grid, Paper
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

function SummaryBar({ start, end, total, results }) {
  const avg     = results.length ? (results.reduce((s, p) => s + p.price, 0) / results.length).toFixed(2) : null
  const onSale  = results.filter(p => p.was).length
  const maxSave = results.reduce((s, p) => p.was ? Math.max(s, p.was - p.price) : s, 0)

  const stats = [
    { label: "Showing",    value: `${start}–${end} of ${total}` },
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

function GroceryCard({ item, isBest, inCart, onToggleCart }) {
  const sc   = storeColor(item.store)
  const stk  = STOCK[item.stock ?? "in"] ?? STOCK.in
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

        {/* Add to cart */}
        <Button
          variant={inCart ? "contained" : "outlined"}
          size="small"
          fullWidth
          disabled={!item.url}
          onClick={() => onToggleCart(item)}
          sx={{
            fontSize: 13,
            fontWeight: 600,
            transition: "all 0.15s",
            ...(inCart
              ? { bgcolor: "#16a34a", "&:hover": { bgcolor: "#15803d" }, borderColor: "transparent" }
              : {}
            ),
          }}
        >
          {inCart ? "✓ Added" : "Add to Cart"}
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

const PAGE_SIZE = 20

export default function GroceryResultsGrid({ results = [], query = "", cartItems = [], onToggleCart }) {
  const [sort,    setSort]    = useState("default")
  const [page,    setPage]    = useState(0)

  const best     = useMemo(() => bestPriceMap(results), [results])
  const cartUrls = cartItems.map(i => i.url)

  const filtered = useMemo(() => {
    let items = [...results]
    if (sort === "price-asc")  items.sort((a, b) => a.price - b.price)
    if (sort === "price-desc") items.sort((a, b) => b.price - a.price)
    if (sort === "savings")    items.sort((a, b) => (b.was ? b.was - b.price : 0) - (a.was ? a.was - a.price : 0))
    if (sort === "name")       items.sort((a, b) => a.name.localeCompare(b.name))
    return items
  }, [results, sort])

  // Reset to page 0 when results or sort changes
  useEffect(() => {
  setPage(0)
}, [results, sort])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const start      = page * PAGE_SIZE
  const end        = Math.min(start + PAGE_SIZE, filtered.length)
  const visible    = filtered.slice(start, end)

  if (!results.length) return null

  return (
    <Box sx={{ mt: 3.5 }}>

      {/* Summary */}
      <SummaryBar
        start={start + 1}
        end={end}
        total={filtered.length}
        results={filtered}
      />

      {/* Grid */}
      <Grid container spacing={1.5}>
        {visible.map((item, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={`${item.store}-${item.name}-${i}`}>
            <GroceryCard
              item={item}
              isBest={item.price === best[item.name]}
              inCart={cartUrls.includes(item.url)}
              onToggleCart={onToggleCart}
            />
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 2.5 }}>
          <Button
            variant="outlined"
            size="small"
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
          >
            ← Previous
          </Button>
          <Typography variant="caption" color="text.secondary">
            Page {page + 1} of {totalPages}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => p + 1)}
          >
            Show next {Math.min(PAGE_SIZE, filtered.length - end)} →
          </Button>
        </Box>
      )}

    </Box>
  )
}