"use client"

import { useEffect, useRef } from "react"

export default function HorizonGlow() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let animationFrameId: number
    const startTime = performance.now()

    const grain = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.150'/%3E%3C/svg%3E")`

    const render = (now: number) => {
      const t = (now - startTime) / 1000 // elapsed seconds

      // Horizon Glow physics specified by 21st.dev
      const ph = t * 0.72
      const amt = 0.62
      const dir = 1
      const spin = ph * dir

      // Swell factors (exactly 0 modulation at ph = 0 since sin(0) = 0)
      // Do not quantise animated values per specification
      const swell = 1 + Math.sin(spin * 0.8) * amt * 0.07
      const backlight = 1 + Math.sin(spin * 0.8) * amt * 0.35

      const r1W = 101 * swell
      const r1H = 49 * swell

      const r2W = 42.42 * backlight
      const r2H = 18.62 * backlight

      const r3W = 53.53 * backlight
      const r3H = 28.42 * backlight

      const domeGradient = `radial-gradient(${r1W}% ${r1H}% at 50% 100%, #fc8279 0%, #FB6A60 23.8%, #FDA096 51.4%, #F52929 79%, rgba(245, 41, 41, 0) 91%)`
      const backlight1 = `radial-gradient(${r2W}% ${r2H}% at 50% 100%, rgba(252, 158, 152, 0.3672) 0%, rgba(251, 106, 96, 0.1428) 38%, rgba(251, 106, 96, 0) 72%)`
      const backlight2 = `radial-gradient(${r3W}% ${r3H}% at 50% 100%, rgba(253, 160, 150, 0.1326) 0%, rgba(253, 160, 150, 0) 80%)`

      el.style.backgroundColor = "#F7F4EC"
      el.style.backgroundImage = `${grain}, ${domeGradient}, ${backlight1}, ${backlight2}`
      el.style.backgroundSize = "120px 120px, auto, auto, auto"
      el.style.backgroundBlendMode = "overlay, normal, normal, normal"

      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none -z-10 transition-opacity duration-700"
      aria-hidden="true"
      style={{
        backgroundColor: "#F7F4EC",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.150'/%3E%3C/svg%3E"), radial-gradient(101% 49% at 50% 100%, #fc8279 0.0%, #FB6A60 23.8%, #FDA096 51.4%, #F52929 79.0%, rgba(245, 41, 41, 0) 91.0%), radial-gradient(42.42% 18.62% at 50% 100%, rgba(252, 158, 152, 0.3672) 0%, rgba(251, 106, 96, 0.1428) 38%, rgba(251, 106, 96, 0) 72%), radial-gradient(53.53% 28.42% at 50% 100%, rgba(253, 160, 150, 0.1326) 0%, rgba(253, 160, 150, 0) 80%)`,
        backgroundSize: "120px 120px, auto, auto, auto",
        backgroundBlendMode: "overlay, normal, normal, normal",
      }}
    />
  )
}
