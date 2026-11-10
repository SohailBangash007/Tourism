import { useEffect } from "react"
import { useLocation } from "react-router-dom"

/**
 * Animates every element carrying a `data-reveal` attribute as it scrolls
 * into view. Re-scans after navigation and when lists are re-rendered.
 */
export default function RevealOnScroll() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const nodes = document.querySelectorAll("[data-reveal]:not(.is-visible)")

    if (reduceMotion || !("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    )

    const observeAll = () => {
      document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach((node) => observer.observe(node))
    }

    observeAll()

    const retry = window.setTimeout(observeAll, 350)
    const mutations = new MutationObserver(() => observeAll())
    mutations.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.clearTimeout(retry)
      mutations.disconnect()
      observer.disconnect()
    }
  }, [pathname, search])

  return null
}
