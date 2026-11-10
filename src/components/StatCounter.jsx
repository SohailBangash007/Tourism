import { useEffect, useRef, useState } from "react"

export default function StatCounter({
  value,
  suffix = "",
  decimals = 0,
  duration = 1800,
  suffixClassName = "text-gold",
}) {
  const ref = useRef(null)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduceMotion || !("IntersectionObserver" in window)) {
      setDisplay(value)
      return undefined
    }

    let frame
    let started = false

    const animate = () => {
      const start = performance.now()
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplay(value * eased)
        if (progress < 1) frame = requestAnimationFrame(tick)
        else setDisplay(value)
      }
      frame = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true
          animate()
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )

    observer.observe(element)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value, duration])

  const formatted = display.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return (
    <span ref={ref}>
      {formatted}
      <span className={suffixClassName}>{suffix}</span>
    </span>
  )
}
