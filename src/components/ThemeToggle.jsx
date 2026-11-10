import { MoonStar, Sun } from "lucide-react"

import { useApp } from "../context/AppContext"
import { cx } from "../utils/format"

export default function ThemeToggle({ solid = true, className = "" }) {
  const { theme, toggleTheme } = useApp()
  const light = theme === "light"

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={light ? "Switch to dark theme" : "Switch to light theme"}
      aria-pressed={light}
      title={light ? "Switch to dark theme" : "Switch to light theme"}
      className={cx(
        "relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border transition-colors duration-300",
        solid
          ? "border-cream/15 text-cream hover:bg-gold hover:text-night"
          : "border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20",
        className,
      )}
    >
      <Sun
        className={cx(
          "absolute h-[17px] w-[17px] transition-all duration-500",
          light ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0",
        )}
      />
      <MoonStar
        className={cx(
          "absolute h-[17px] w-[17px] transition-all duration-500",
          light ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100",
        )}
      />
    </button>
  )
}
