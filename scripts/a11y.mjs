import puppeteer from "puppeteer-core"
import fs from "node:fs"

const axe = fs.readFileSync("node_modules/axe-core/axe.min.js", "utf8")
const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: "new",
  args: ["--no-sandbox"],
})

const paths = [
  "/",
  "/destinations",
  "/destinations/hunza",
  "/tours",
  "/gallery",
  "/about",
  "/journal",
  "/journal/hunza-in-autumn",
  "/contact",
  "/booking",
  "/wishlist",
  "/booking?tour=hunza-autumn&adults=4",
]

const themes = ["light", "dark"]
let totalSerious = 0

for (const theme of themes) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.evaluateOnNewDocument((value) => {
    localStorage.setItem("dream-theme", value)
  }, theme)

  for (const path of paths) {
    await page.goto(`http://localhost:4173${path}`, { waitUntil: "networkidle2" })
    await new Promise((resolve) => setTimeout(resolve, 1800))
    await page.evaluate(axe)
    const result = await page.evaluate(async () => await window.axe.run(document, { resultTypes: ["violations"] }))
    const serious = result.violations.filter((violation) => ["serious", "critical"].includes(violation.impact))
    totalSerious += serious.length
    console.log(
      `${serious.length ? "✗" : "✓"} [${theme}] ${path} — ${result.violations.length} violations (${serious.length} serious/critical)`,
    )
    for (const violation of serious) {
      console.log(`   ${violation.impact}: ${violation.id} — ${violation.nodes.length} node(s)`)
      violation.nodes.forEach((node) => {
        const html = node.html.length > 120 ? `${node.html.slice(0, 120)}…` : node.html
        console.log(`     ${node.target.join(" ")}`)
        console.log(`       ${html}`)
        console.log(
          `       ${node.failureSummary?.split("\n").filter((line) => line.includes("contrast") || line.includes("name")).slice(0, 2).join(" | ")}`,
        )
      })
    }
    for (const violation of result.violations.filter((v) => !["serious", "critical"].includes(v.impact))) {
      console.log(`   minor/moderate: ${violation.id} (${violation.nodes.length})`)
    }
  }

  await page.close()
}

await browser.close()
console.log(`\n${totalSerious ? `${totalSerious} serious/critical violation group(s)` : "0 serious/critical violations"}`)
process.exit(totalSerious ? 1 : 0)
