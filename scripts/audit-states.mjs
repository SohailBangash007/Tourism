import fs from "node:fs"
import puppeteer from "puppeteer-core"

const axe = fs.readFileSync("node_modules/axe-core/axe.min.js", "utf8")
const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: "new",
  args: ["--no-sandbox"],
})

const clickText = (page, tag, label) =>
  page.evaluate(
    (tagName, labelText) => {
      const node = [...document.querySelectorAll(tagName)].find((item) =>
        item.textContent.trim().toLowerCase().includes(labelText.toLowerCase()),
      )
      if (node) node.click()
    },
    tag,
    label,
  )

let problems = 0

for (const theme of ["light", "dark"]) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.evaluateOnNewDocument((value) => localStorage.setItem("dream-theme", value), theme)

  const run = async (label) => {
    await page.evaluate(axe)
    const result = await page.evaluate(async () => await window.axe.run(document, { resultTypes: ["violations"] }))
    const serious = result.violations.filter((v) => ["serious", "critical"].includes(v.impact))
    problems += serious.length
    console.log(`${serious.length ? "✗" : "✓"} [${theme}] ${label} — ${result.violations.length} violations`)
    serious.forEach((v) => {
      console.log(`   ${v.id}: ${v.nodes.length} — ${v.nodes[0]?.target.join(" ")}`)
      v.nodes.forEach((node) => {
        console.log(`     ${node.html.slice(0, 160)}`)
        console.log(`     ${node.failureSummary?.split("\n").slice(-1)[0]}`)
      })
    })
  }

  await page.goto("http://localhost:4173/", { waitUntil: "networkidle2" })
  await page.evaluate(() => window.scrollTo(0, 900))
  await new Promise((r) => setTimeout(r, 700))
  await run("home scrolled / solid navbar")

  await page.goto("http://localhost:4173/booking?tour=hunza-autumn&adults=4", { waitUntil: "networkidle2" })
  await new Promise((r) => setTimeout(r, 600))
  await clickText(page, "button", "Continue")
  await new Promise((r) => setTimeout(r, 1400))
  await run("booking step 2")
  await clickText(page, "button", "Continue")
  await new Promise((r) => setTimeout(r, 1400))
  await run("booking step 3")

  await page.goto("http://localhost:4173/gallery", { waitUntil: "networkidle2" })
  await new Promise((r) => setTimeout(r, 500))
  await clickText(page, "button", "First light, Passu Cones")
  await new Promise((r) => setTimeout(r, 1400))
  await run("gallery lightbox")

  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })
  await page.goto("http://localhost:4173/", { waitUntil: "networkidle2" })
  await page.click('button[aria-controls="mobile-navigation"]')
  await new Promise((r) => setTimeout(r, 1400))
  await run("mobile drawer")

  await page.close()
}

await browser.close()
console.log(problems ? `\n${problems} serious group(s)` : "\nAll interactive states clean")
