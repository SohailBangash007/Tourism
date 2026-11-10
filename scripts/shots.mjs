import fs from "node:fs"
import puppeteer from "puppeteer-core"

const BASE = process.env.BASE_URL || "http://localhost:4173"
const outDir = "scripts/shots"
fs.mkdirSync(outDir, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
})

const targets = [
  ["home", "/", 1440, 1000],
  ["destinations", "/destinations", 1440, 1000],
  ["destination-detail", "/destinations/hunza", 1440, 1000],
  ["tours", "/tours", 1440, 1000],
  ["booking", "/booking", 1440, 1000],
  ["about", "/about", 1440, 1000],
  ["gallery", "/gallery", 1440, 1000],
  ["journal", "/journal", 1440, 1000],
  ["contact", "/contact", 1440, 1000],
]

for (const theme of ["light", "dark"]) {
  for (const [name, path, width, height] of targets) {
    const page = await browser.newPage()
    await page.setViewport({ width, height })
    await page.evaluateOnNewDocument((value) => {
      localStorage.setItem("dream-theme", value)
    }, theme)
    await page.goto(`${BASE}${path}`, { waitUntil: "networkidle2", timeout: 45000 })
    await new Promise((resolve) => setTimeout(resolve, 1400))
    await page.screenshot({ path: `${outDir}/${name}-${theme}.png` })
    await page.close()
    console.log(`shot ${name}-${theme}`)
  }
}

// mobile home, both themes
for (const theme of ["light", "dark"]) {
  const page = await browser.newPage()
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })
  await page.evaluateOnNewDocument((value) => {
    localStorage.setItem("dream-theme", value)
  }, theme)
  await page.goto(`${BASE}/`, { waitUntil: "networkidle2" })
  await new Promise((resolve) => setTimeout(resolve, 1200))
  await page.screenshot({ path: `${outDir}/home-mobile-${theme}.png` })
  await page.close()
}

await browser.close()
