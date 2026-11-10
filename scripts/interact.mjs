import puppeteer from "puppeteer-core"

const BASE = process.env.BASE_URL || "http://localhost:4173"
const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
})

const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.evaluateOnNewDocument(() => {
  if (!localStorage.getItem("dream-theme")) localStorage.setItem("dream-theme", "light")
})
const errors = []
page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`))
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(`console: ${msg.text()}`)
})

const results = []
const check = (name, condition, detail = "") => {
  results.push({ name, ok: Boolean(condition), detail })
}

const go = async (path) => {
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle2", timeout: 45000 })
  await new Promise((resolve) => setTimeout(resolve, 600))
}

const text = () => page.evaluate(() => document.body.innerText)
const clickText = (tag, label) =>
  page.evaluate(
    (tagName, labelText) => {
      const nodes = [...document.querySelectorAll(tagName)]
      const node = nodes.find((item) => item.textContent.trim().toLowerCase().includes(labelText.toLowerCase()))
      if (!node) throw new Error(`No ${tagName} containing “${labelText}”`)
      node.click()
      return true
    },
    tag,
    label,
  )

// ---- Fonts / theme ----
await go("/")
const fonts = await page.evaluate(() => ({
  h1: getComputedStyle(document.querySelector("h1")).fontFamily,
  body: getComputedStyle(document.body).fontFamily,
  bg: getComputedStyle(document.body).backgroundColor,
}))
check("Display font is Fraunces", fonts.h1.includes("Fraunces"), fonts.h1)
check("Body font is Manrope", fonts.body.includes("Manrope"), fonts.body)
check("Light theme is the default", fonts.bg.includes("242, 244, 239"), fonts.bg)

await page.click('header button[aria-label="Switch to dark theme"]')
await new Promise((resolve) => setTimeout(resolve, 600))
const darkState = await page.evaluate(() => ({
  dark: !document.documentElement.classList.contains("light"),
  stored: localStorage.getItem("dream-theme"),
  bg: getComputedStyle(document.body).backgroundColor,
}))
check(
  "Theme toggle switches to dark",
  darkState.dark && darkState.stored === "dark" && darkState.bg.includes("5, 15, 11"),
  `${darkState.stored} · ${darkState.bg}`,
)
await page.click('header button[aria-label="Switch to light theme"]')
await new Promise((resolve) => setTimeout(resolve, 600))
check("Theme toggle switches back to light", await page.evaluate(() => document.documentElement.classList.contains("light")))

// ---- Hero search → tours ----
await page.select("#search-where", "maldives")
await page.select("#search-style", "Beaches")
await clickText("button", "Find my journey")
await new Promise((resolve) => setTimeout(resolve, 800))
check("Hero search routes to tours", page.url().includes("/tours?"), page.url())
check("Hero search prefilters destination", (await text()).includes("Maldives Barefoot Honeymoon"))

// ---- Destination search + region + sort ----
await go("/destinations")
const totalCards = await page.$$eval("article", (nodes) => nodes.length)
await page.type("#destination-search", "kyoto")
await new Promise((resolve) => setTimeout(resolve, 500))
const searchCards = await page.$$eval("article", (nodes) => nodes.length)
check("Destination search narrows results", totalCards === 12 && searchCards === 1, `${totalCards} → ${searchCards}`)
await page.evaluate(() => {
  const input = document.querySelector("#destination-search")
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set
  setter.call(input, "")
  input.dispatchEvent(new Event("input", { bubbles: true }))
})
await new Promise((resolve) => setTimeout(resolve, 400))
await clickText("button", "Europe")
await new Promise((resolve) => setTimeout(resolve, 500))
const europeCards = await page.$$eval("article", (nodes) => nodes.length)
check("Region filter works (Europe)", europeCards === 3, `${europeCards} cards`)
await page.select("#destination-sort", "price-low")
await new Promise((resolve) => setTimeout(resolve, 400))
const firstPrice = await page.evaluate(() => document.querySelector("article")?.innerText.match(/from\s*\$([\d,]+)/i)?.[1])
check("Sort by price works", firstPrice === "1,890", `first price $${firstPrice}`)

// ---- Wishlist ----
await page.evaluate(() => {
  const clear = [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === "Clear")
  if (clear) clear.click()
})
await new Promise((resolve) => setTimeout(resolve, 400))
await go("/destinations/hunza")
await clickText("button", "Save")
await new Promise((resolve) => setTimeout(resolve, 400))
const badge = await page.evaluate(() => document.querySelector('a[href="/wishlist"]')?.textContent.trim())
check("Heart saves to wishlist (nav badge)", badge === "1", badge)
await go("/wishlist")
const wishlistText = await text()
check("Wishlist page lists saved destination", wishlistText.includes("Hunza Valley") && wishlistText.includes("1 saved place"))
const persisted = await page.evaluate(() => localStorage.getItem("dream-favorites"))
check("Wishlist persists in localStorage", persisted?.includes("hunza"), persisted)
await clickText("button", "Clear all")
await new Promise((resolve) => setTimeout(resolve, 500))
check("Wishlist clears", (await text()).includes("Nothing saved just yet"))

// ---- Gallery lightbox ----
await go("/gallery")
await clickText("button", "First light, Passu Cones")
await new Promise((resolve) => setTimeout(resolve, 500))
const dialogOpen = await page.$('[role="dialog"]')
check("Gallery lightbox opens", Boolean(dialogOpen))
await page.keyboard.press("ArrowRight")
await new Promise((resolve) => setTimeout(resolve, 300))
const counter = await page.evaluate(() => document.querySelector('[role="dialog"]')?.innerText.match(/\d+ \/ \d+/)?.[0])
check("Lightbox arrow navigation works", counter === "2 / 8", counter)
await page.keyboard.press("Escape")
await new Promise((resolve) => setTimeout(resolve, 300))
check("Lightbox closes on Escape", !(await page.$('[role="dialog"]')))

for (const tab of ["Mountains", "Lakes", "Culture", "Beaches", "Cities"]) {
  await clickText("button", tab)
  await new Promise((resolve) => setTimeout(resolve, 500))
  const photos = await page.$$eval(".masonry-item", (nodes) => nodes.length)
  check(`Gallery “${tab}” tab shows 8 photos`, photos === 8, `${photos} photos`)
}

const selectedTab = await page.evaluate(
  () => document.querySelector('[role="tab"][aria-selected="true"]')?.textContent.trim(),
)
check("Gallery tab state is exposed to assistive tech", selectedTab?.startsWith("Cities"), selectedTab)

// ---- Itinerary accordion ----
await go("/destinations/switzerland")
const openDayBefore = await page.evaluate(
  () => [...document.querySelectorAll("button[aria-expanded]")].filter((b) => b.getAttribute("aria-expanded") === "true").length,
)
await clickText("button", "Matterhorn day")
await new Promise((resolve) => setTimeout(resolve, 400))
const openDayAfter = await page.evaluate(
  () => [...document.querySelectorAll("button[aria-expanded]")].filter((b) => b.getAttribute("aria-expanded") === "true").length,
)
check("Itinerary accordion toggles", openDayBefore === 1 && openDayAfter === 1, `${openDayBefore} → ${openDayAfter}`)

// ---- Contact form validation ----
await go("/contact")
await clickText("button", "Send my note")
await new Promise((resolve) => setTimeout(resolve, 400))
let pageText = await text()
check("Contact form shows validation errors", pageText.includes("Please tell us your name"))
await page.type("#contact-name", "Test Traveller")
await page.type("#contact-email", "not-an-email")
await page.type("#contact-message", "We would love to visit Hunza in October with four friends.")
await clickText("button", "Send my note")
await new Promise((resolve) => setTimeout(resolve, 400))
check("Contact form rejects invalid email", (await text()).includes("valid email address"))
await page.evaluate(() => {
  const input = document.querySelector("#contact-email")
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set
  setter.call(input, "test@example.com")
  input.dispatchEvent(new Event("input", { bubbles: true }))
})
await page.click("#contact-consent")
await clickText("button", "Send my note")
await new Promise((resolve) => setTimeout(resolve, 700))
check("Contact form submits successfully", (await text()).includes("Your note is with us"))

// ---- Newsletter ----
await go("/")
await page.evaluate(() => {
  const input = document.querySelector("#newsletter-email")
  input.scrollIntoView({ block: "center" })
})
await new Promise((resolve) => setTimeout(resolve, 600))
await page.type("#newsletter-email", "bad-email")
await clickText("button", "Join the letter")
await new Promise((resolve) => setTimeout(resolve, 500))
check("Newsletter rejects invalid email", (await text()).includes("Please enter a valid email address"))
await page.evaluate(() => {
  const input = document.querySelector("#newsletter-email")
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set
  setter.call(input, "reader@example.com")
  input.dispatchEvent(new Event("input", { bubbles: true }))
})
await clickText("button", "Join the letter")
await new Promise((resolve) => setTimeout(resolve, 600))
check("Newsletter confirms subscription", (await text()).includes("You're on the list"))

// ---- Booking flow ----
await go("/booking?tour=hunza-autumn&adults=4")
let bookingText = await text()
check("Booking preloads tour", bookingText.includes("Hunza Autumn Escape"))
check("Group discount applied for 4 travellers", bookingText.includes("Group saving (10%)"), "10% row present")
const totalValue = await page.evaluate(() => {
  const match = document.body.innerText.match(/Total\s*\$([\d,]+)/i)
  return match?.[1]
})
check("Booking total is calculated", totalValue === "4,933", `$${totalValue}`)
await clickText("button", "Continue")
await new Promise((resolve) => setTimeout(resolve, 600))
check("Booking step 1 → 2", (await text()).includes("Who is travelling"))
const defaultFirstName = await page.$eval("#booking-first", (el) => el.value)
check("First name defaults to Sohail", defaultFirstName === "Sohail", defaultFirstName)
await page.evaluate(() => {
  const input = document.querySelector("#booking-first")
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set
  setter.call(input, "")
  input.dispatchEvent(new Event("input", { bubbles: true }))
})
await new Promise((resolve) => setTimeout(resolve, 250))
await clickText("button", "Continue")
await new Promise((resolve) => setTimeout(resolve, 500))
check("Traveller validation blocks empty step", (await text()).includes("Please enter your first name"))
await page.type("#booking-first", "Sohail")
await page.type("#booking-last", "Khan")
await page.type("#booking-email", "ayesha@example.com")
await page.type("#booking-phone", "+92 300 1234567")
await clickText("button", "Continue")
await new Promise((resolve) => setTimeout(resolve, 700))
check("Booking step 2 → 3", (await text()).includes("Almost there"))
await clickText("button", "Confirm booking request")
await new Promise((resolve) => setTimeout(resolve, 500))
check("Terms validation blocks confirmation", (await text()).includes("Please agree to the booking terms"))
await page.click("#booking-terms")
await clickText("button", "Confirm booking request")
await new Promise((resolve) => setTimeout(resolve, 800))
bookingText = await text()
const reference = bookingText.match(/DRM-\d{4}-\d{4}/)?.[0]
check("Booking confirms with a reference", Boolean(reference), reference)
check("Confirmation modal shows summary", bookingText.includes("Your journey starts here") && bookingText.includes("Hunza Autumn Escape"))
const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("dream-bookings") || "[]").length)
check("Booking saved locally", stored === 1, `${stored} booking(s)`)

// ---- Mobile nav ----
const mobile = await browser.newPage()
await mobile.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })
await mobile.goto(`${BASE}/`, { waitUntil: "networkidle2" })
await new Promise((resolve) => setTimeout(resolve, 500))
await mobile.click('button[aria-controls="mobile-navigation"]')
await new Promise((resolve) => setTimeout(resolve, 700))
const drawerVisible = await mobile.evaluate(() => {
  const aside = document.querySelector("#mobile-navigation")
  const rect = aside.getBoundingClientRect()
  const style = getComputedStyle(aside)
  const translated = style.translate !== "none" || style.transform !== "none"
  return translated && rect.left >= 0 && rect.left < window.innerWidth && rect.right > 0
})
check("Mobile drawer opens", drawerVisible)
await mobile.evaluate(() => {
  const link = [...document.querySelectorAll("#mobile-navigation a")].find((a) => a.textContent.includes("Destinations"))
  link.click()
})
await new Promise((resolve) => setTimeout(resolve, 900))
check("Mobile drawer link navigates", mobile.url().endsWith("/destinations"), mobile.url())
check("Mobile drawer closes after navigation", !(await mobile.evaluate(() => document.body.classList.contains("nav-open"))))
await mobile.close()

await browser.close()

const failed = results.filter((result) => !result.ok)
for (const result of results) {
  console.log(`${result.ok ? "✓" : "✗"} ${result.name}${result.detail ? `  (${result.detail})` : ""}`)
}
if (errors.length) {
  console.log("\nRuntime errors:")
  errors.forEach((error) => console.log(`  - ${error}`))
}
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
process.exit(failed.length || errors.length ? 1 : 0)
