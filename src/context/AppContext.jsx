import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { CheckCircle2, Heart, X } from "lucide-react"

const AppContext = createContext(null)

const STORAGE_KEY = "dream-favorites"
const THEME_KEY = "dream-theme"

function readFavorites() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}

function readTheme() {
  if (typeof document !== "undefined") {
    return document.documentElement.classList.contains("light") ? "light" : "dark"
  }
  return "dark"
}

export function AppProvider({ children }) {
  const [favorites, setFavorites] = useState(readFavorites)
  const [theme, setTheme] = useState(readTheme)
  const [toast, setToast] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      /* storage may be unavailable — the site still works */
    }
  }, [favorites])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("light", theme === "light")
    root.dataset.theme = theme
    root.style.colorScheme = theme
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "light" ? "#f2f4ef" : "#050f0b")
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      /* storage may be unavailable — the theme still works for this visit */
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "light" ? "dark" : "light"))
  }, [])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const dismissToast = useCallback(() => {
    clearTimeout(timerRef.current)
    setToast(null)
  }, [])

  const notify = useCallback(
    (message, type = "success") => {
      clearTimeout(timerRef.current)
      setToast({ message, type })
      timerRef.current = setTimeout(() => setToast(null), 3800)
    },
    [],
  )

  const toggleFavorite = useCallback(
    (id, name) => {
      const isSaved = favorites.includes(id)
      setFavorites((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
      notify(isSaved ? `${name} removed from your wishlist` : `${name} saved to your wishlist`, isSaved ? "info" : "success")
    },
    [favorites, notify],
  )

  const isFavorite = useCallback((id) => favorites.includes(id), [favorites])

  const clearFavorites = useCallback(() => {
    setFavorites([])
    notify("Wishlist cleared.", "info")
  }, [notify])

  const value = useMemo(
    () => ({ favorites, toggleFavorite, isFavorite, clearFavorites, notify, theme, toggleTheme }),
    [favorites, toggleFavorite, isFavorite, clearFavorites, notify, theme, toggleTheme],
  )

  return (
    <AppContext.Provider value={value}>
      {children}
      {toast && (
        <div
          role="status"
          className="on-dark fixed bottom-6 left-5 z-[300] flex max-w-[calc(100vw-2.5rem)] items-center gap-3 rounded-2xl border border-white/10 bg-forest-deep px-4 py-3.5 text-sm font-semibold text-cream shadow-float animate-slide-up sm:left-8 sm:max-w-sm"
        >
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
              toast.type === "info" ? "bg-white/10 text-gold-soft" : "bg-gold text-night"
            }`}
          >
            {toast.type === "info" ? <Heart className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
          </span>
          <p className="pr-2 leading-snug">{toast.message}</p>
          <button
            type="button"
            onClick={dismissToast}
            aria-label="Dismiss notification"
            className="ml-auto rounded-full p-1 text-cream/50 transition hover:bg-white/10 hover:text-cream"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error("useApp must be used inside AppProvider")
  return context
}
