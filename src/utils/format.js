export const formatPrice = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0)

export const formatDate = (iso) => {
  if (!iso) return "—"
  const date = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export const cx = (...classes) => classes.filter(Boolean).join(" ")

export const todayISO = (offset = 0) => {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return date.toISOString().slice(0, 10)
}

export const nightsBetween = (start, end) => {
  if (!start || !end) return 0
  const diff = (new Date(`${end}T12:00:00`) - new Date(`${start}T12:00:00`)) / 86400000
  return diff > 0 ? Math.round(diff) : 0
}
