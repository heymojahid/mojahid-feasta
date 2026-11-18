"use client"

import { useEffect, useRef } from "react"

export default function HorizonGlow() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // Ensure document and body are light parchment while this page is mounted
    const html = document.documentElement
    const body = document.body
    const originalHtmlBg = html.style.backgroundColor
    const originalBodyBg = body.style.backgroundColor
    const hadDark = html.classList.contains("dark")

    html.classList.remove("dark")
    html.style.backgroundColor = "#F7F4EC"
    body.style.backgroundColor = "#F7F4EC"

    let animationFrameId: number
    const startTime = performance.now()

    // 21st.dev Fractal noise grain texture
    const grain = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.150'/%3E%3C/svg%3E")`

    const render = (now: number) => {
      const t = (now - startTime) / 1000 // elapsed seconds

      // 21st.dev Horizon Glow exact motion parameters
      const ph = t * 0.72
      const amt = 0.62
      const dir = 1
      const spin = ph * dir

      // Swell formulas (exact 0 at ph = 0 since sin(0) = 0)
      // No Math.round per 21st.dev instructions
      const swell = 1 + Math.sin(spin * 0.8) * amt * 0.07
      const backlight = 1 + Math.sin(spin * 0.8) * amt * 0.35

      const r1W = 101 * swell
      const r1H = 56 * swell // Generous arch height for desktop & mobile

      const r2W = 48 * backlight
      const r2H = 24 * backlight

      const r3W = 60 * backlight
      const r3H = 34 * backlight

      const domeGradient = `radial-gradient(${r1W}% ${r1H}% at 50% 100%, #fc8279 0%, #FB6A60 23.8%, #FDA096 51.4%, #F52929 79%, rgba(245, 41, 41, 0) 91%)`
      const backlight1 = `radial-gradient(${r2W}% ${r2H}% at 50% 100%, rgba(252, 158, 152, 0.42) 0%, rgba(251, 106, 96, 0.18) 38%, rgba(251, 106, 96, 0) 72%)`
      const backlight2 = `radial-gradient(${r3W}% ${r3H}% at 50% 100%, rgba(253, 160, 150, 0.22) 0%, rgba(253, 160, 150, 0) 80%)`
      const topWarmth = `radial-gradient(100% 40% at 50% 0%, rgba(253, 160, 150, 0.06) 0%, transparent 100%)`

      el.style.backgroundColor = "#F7F4EC"
      el.style.backgroundImage = `${grain}, ${domeGradient}, ${backlight1}, ${backlight2}, ${topWarmth}`
      el.style.backgroundSize = "120px 120px, auto, auto, auto, auto"
      el.style.backgroundBlendMode = "overlay, normal, normal, normal, normal"

      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrameId)
      html.style.backgroundColor = originalHtmlBg
      body.style.backgroundColor = originalBodyBg
      if (hadDark) {
        html.classList.add("dark")
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
      style={{
        backgroundColor: "#F7F4EC",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.150'/%3E%3C/svg%3E"), radial-gradient(101% 56% at 50% 100%, #fc8279 0.0%, #FB6A60 23.8%, #FDA096 51.4%, #F52929 79.0%, rgba(245, 41, 41, 0) 91.0%), radial-gradient(48% 24% at 50% 100%, rgba(252, 158, 152, 0.42) 0%, rgba(251, 106, 96, 0.18) 38%, rgba(251, 106, 96, 0) 72%), radial-gradient(60% 34% at 50% 100%, rgba(253, 160, 150, 0.22) 0%, rgba(253, 160, 150, 0) 80%)`,
        backgroundSize: "120px 120px, auto, auto, auto",
        backgroundBlendMode: "overlay, normal, normal, normal",
      }}
    />
  )
}
