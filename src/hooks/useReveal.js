import { useEffect, useRef } from "react"

/**
 * Adds a scroll-reveal effect to a single element. Returns a ref and the
 * props needed on that element. Safe for reduced motion and older browsers.
 */
export default function useReveal(delay = 0) {
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduceMotion || !("IntersectionObserver" in window)) {
      element.classList.add("is-visible")
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("is-visible")
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return {
    ref,
    className: "reveal",
    style: delay ? { transitionDelay: `${delay}ms` } : undefined,
  }
}
