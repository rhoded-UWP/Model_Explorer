// Small helpers that turn raw API values into display text.
// Keeping them out of the components means the JSX stays readable, and every
// helper handles missing data the same way: it returns NOT_LISTED instead of
// letting "undefined" or "NaN" reach the page.

export const NOT_LISTED = 'Not listed'

// 1707778 -> "1,707,778" (or "1.707.778" in some locales; toLocaleString
// follows the visitor's browser settings).
export function formatNumber(value) {
  if (typeof value !== 'number') return NOT_LISTED
  return value.toLocaleString()
}

// 753329940480 -> "753B parameters", 11959730224 -> "12B parameters".
// Model sizes range from thousands to trillions, so we pick the largest unit
// that fits and keep three significant digits (753, 12.0 -> 12, 7.62).
export function formatParameters(count) {
  if (typeof count !== 'number' || count <= 0) return NOT_LISTED

  const units = [
    { size: 1e12, suffix: 'T' },
    { size: 1e9, suffix: 'B' },
    { size: 1e6, suffix: 'M' },
    { size: 1e3, suffix: 'K' },
  ]
  const unit = units.find((u) => count >= u.size)
  if (!unit) return `${count} parameters`

  const short = (count / unit.size).toLocaleString(undefined, {
    maximumSignificantDigits: 3,
  })
  return `${short}${unit.suffix} parameters`
}

// "2026-08-25T06:42:50.000Z" -> "8/25/2026" (format follows the browser locale).
export function formatDate(isoString) {
  if (!isoString) return NOT_LISTED
  const date = new Date(isoString)
  // An unparseable string gives an "Invalid Date" object rather than an error,
  // so check for it explicitly.
  if (Number.isNaN(date.getTime())) return NOT_LISTED
  return date.toLocaleDateString()
}

// The API sends `gated: false` for open models, or a string such as "auto" or
// "manual" describing how access requests are approved.
export function formatGated(gated) {
  if (gated === false) return 'No, anyone can download it'
  if (typeof gated === 'string') return `Yes, access requests are approved (${gated})`
  return NOT_LISTED
}

// Use this for plain text fields (author, license, library) that may be missing.
export function textOrNotListed(value) {
  return value ? String(value) : NOT_LISTED
}
