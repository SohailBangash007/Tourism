import fs from "node:fs"
import path from "node:path"

const root = "."
const files = []
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", "dist", ".git"].includes(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full)
    else files.push(full)
  }
}
walk(root)

const rebrand = (text) =>
  text
    .replace(/DRM-/g, "DRM-")
    .replace(/DRM/g, "DRM")
    .replace(/Dream/g, "Dream")
    .replace(/dream/g, "dream")

const theme = (text) =>
  text
    // light chips that stay light need dark text
    .replace(/bg-cream\/95 px-3\.5 py-1\.5 text-\[13px\] font-extrabold text-forest/g, "bg-cream/95 px-3.5 py-1.5 text-[13px] font-extrabold text-night")
    .replace(/bg-cream\/95 px-3 py-1\.5 text-\[10px\] font-extrabold uppercase tracking-\[0\.1em\] text-forest/g, "bg-cream/95 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-night")
    .replace(/bg-cream\/95 px-3 py-1\.5 text-\[9px\] font-extrabold uppercase tracking-\[0\.14em\] text-forest/g, "bg-cream/95 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.14em] text-night")
    // accents
    .replace(/bg-forest text-cream shadow-sm/g, "bg-gold text-night shadow-sm")
    .replace(/active && "bg-forest text-cream"/g, 'active && "bg-gold text-night"')
    .replace(/checked \? "bg-forest text-cream" : "bg-sand\/60 text-forest"/g, 'checked ? "bg-gold text-night" : "bg-white/5 text-cream"')
    .replace(/checked \? "border-forest bg-forest" : "border-muted\/40"/g, 'checked ? "border-gold bg-gold" : "border-cream/30"')
    .replace(/\? "border-forest bg-forest text-cream"/g, '? "border-gold bg-gold text-night"')
    .replace(/hover:bg-forest hover:text-cream/g, "hover:bg-gold hover:text-night")
    // borders
    .replace(/border-forest\/30/g, "border-cream/30")
    .replace(/border-forest\/20/g, "border-cream/20")
    .replace(/border-forest\/15/g, "border-cream/15")
    .replace(/ring-forest\/20/g, "ring-gold/25")
    // backgrounds
    .replace(/bg-white\/80/g, "bg-surface/80")
    .replace(/bg-white\/60/g, "bg-surface/60")
    .replace(/bg-white\/50/g, "bg-surface/50")
    .replace(/bg-white(?![-/])/g, "bg-surface")
    .replace(/bg-cream(?![-/])/g, "bg-surface")
    .replace(/bg-sand\/70/g, "bg-white/[0.06]")
    .replace(/bg-sand\/60/g, "bg-white/5")
    .replace(/bg-sand\/50/g, "bg-white/5")
    .replace(/bg-sand\/45/g, "bg-white/[0.03]")
    .replace(/bg-sand\/40/g, "bg-white/5")
    .replace(/bg-sand(?![-/])/g, "bg-white/5")
    // text
    .replace(/text-forest(?![-/])/g, "text-cream")
    // form option / glass surfaces handled in CSS

for (const file of files) {
  const ext = path.extname(file)
  if (![".js", ".jsx", ".css", ".html", ".md", ".json", ".txt", ".mjs", ".svg"].includes(ext)) continue
  let text = fs.readFileSync(file, "utf8")
  const original = text
  text = rebrand(text)
  if (file.startsWith(path.join("src"))) text = theme(text)
  if (text !== original) {
    fs.writeFileSync(file, text)
    console.log("updated", file)
  }
}
