import puppeteer from "puppeteer-core"
import fs from "node:fs"

const BASE = process.env.BASE_URL || "http://localhost:4173"
const paths = [
  "/",
  "/destinations",
  "/destinations/hunza",
  "/destinations/maldives",
  "/tours",
  "/gallery",
  "/about",
  "/journal",
  "/journal/hunza-in-autumn",
  "/contact",
  "/booking",
  "/booking?tour=hunza-autumn&adults=4",
  "/wishlist",
  "/this-does-not-exist",
]

const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
})

const results = []

for (const path of paths) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  const errors = []
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console: ${msg.text()}`)
  })
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`))
  page.on("requestfailed", (req) => {
    if (!req.url().includes("fonts.googleapis") && !req.url().includes("fonts.gstatic")) {
      errors.push(`requestfailed: ${req.url()} ${req.failure()?.errorText}`)
    }
  })

  let status = "ok"
  try {
    const response = await page.goto(`${BASE}${path}`, { waitUntil: "networkidle2", timeout: 45000 })
    if (response && !response.ok()) status = `http ${response.status()}`
    await new Promise((resolve) => setTimeout(resolve, 400))

    // scroll through the page so scroll-reveal elements get a chance to appear
    await page.evaluate(async () => {
      for (let i = 0; i < 60; i += 1) {
        window.scrollBy(0, Math.round(window.innerHeight * 0.75))
        await new Promise((resolve) => setTimeout(resolve, 110))
        if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 4) break
      }
      window.scrollTo(0, document.body.scrollHeight)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    })
    await new Promise((resolve) => setTimeout(resolve, 700))

    const info = await page.evaluate(() => {
      const broken = [...document.images]
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => img.getAttribute("src"))
      const h1 = document.querySelector("h1")?.textContent?.trim().slice(0, 80) || null
      const revealHidden = document.querySelectorAll("[data-reveal]:not(.is-visible)").length
      const bodyWidth = document.body.scrollWidth
      const viewport = window.innerWidth
      return {
        title: document.title,
        h1,
        images: document.images.length,
        broken,
        revealHidden,
        overflowX: bodyWidth > viewport + 2 ? bodyWidth - viewport : 0,
        text: document.body.innerText.length,
      }
    })

    results.push({ path, status, errors, ...info })
  } catch (error) {
    results.push({ path, status: "failed", errors: [...errors, error.message] })
  }

  await page.close()
}

// mobile pass
for (const path of ["/", "/destinations", "/booking", "/gallery"]) {
  const page = await browser.newPage()
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })
  const errors = []
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`))
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console: ${msg.text()}`)
  })
  try {
    await page.goto(`${BASE}${path}`, { waitUntil: "networkidle2", timeout: 45000 })
    await new Promise((resolve) => setTimeout(resolve, 700))
    const info = await page.evaluate(() => ({
      overflowX: document.body.scrollWidth > window.innerWidth + 2 ? document.body.scrollWidth - window.innerWidth : 0,
      h1: document.querySelector("h1")?.textContent?.trim().slice(0, 60) || null,
      broken: [...document.images].filter((img) => img.complete && img.naturalWidth === 0).map((img) => img.getAttribute("src")),
    }))
    results.push({ path: `[mobile] ${path}`, status: "ok", errors, ...info })
  } catch (error) {
    results.push({ path: `[mobile] ${path}`, status: "failed", errors: [...errors, error.message] })
  }
  await page.close()
}

await browser.close()
fs.writeFileSync("scripts/check-results.json", JSON.stringify(results, null, 2))
for (const result of results) {
  const problems = []
  if (result.status !== "ok") problems.push(result.status)
  if (result.errors?.length) problems.push(...result.errors)
  if (result.broken?.length) problems.push(`broken images: ${result.broken.length} → ${result.broken.slice(0, 4).join(", ")}`)
  if (result.overflowX) problems.push(`overflow-x ${result.overflowX}px`)
  if (result.revealHidden) problems.push(`${result.revealHidden} reveal elements never shown`)
  console.log(`${problems.length ? "✗" : "✓"} ${result.path}  ${result.h1 ? `| ${result.h1}` : ""}`)
  problems.forEach((problem) => console.log(`    - ${problem}`))
}
