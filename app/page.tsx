"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import HorizonGlow from "@/components/ui/HorizonGlow"
import { 
  Lock, 
  Unlock, 
  Sparkles, 
  Mail, 
  Copy, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  KeyRound,
  Instagram
} from "lucide-react"

export default function LaunchingSoonPage() {
  const router = useRouter()

  // Countdown target logic (7 days from start)
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  }>({ days: 7, hours: 0, minutes: 0, seconds: 0 })

  const [accessCode, setAccessCode] = useState("")
  const [accessGranted, setAccessGranted] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize target date: 7 days from now (persisted in localStorage)
  useEffect(() => {
    const STORAGE_KEY = "mojahid-ai:launch-target"
    let targetTimestamp: number

    const savedTarget = localStorage.getItem(STORAGE_KEY)
    if (savedTarget && !isNaN(Number(savedTarget))) {
      targetTimestamp = Number(savedTarget)
    } else {
      targetTimestamp = Date.now() + 7 * 24 * 60 * 60 * 1000
      localStorage.setItem(STORAGE_KEY, targetTimestamp.toString())
    }

    // Check if already unlocked
    const storedAccess = localStorage.getItem("mojahid_access_granted")
    if (storedAccess === "MOJAHID26") {
      setAccessGranted(true)
    }

    const updateTimer = () => {
      const now = Date.now()
      const diff = targetTimestamp - now

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleUnlock = () => {
    const candidate = accessCode.trim().toUpperCase()
    setErrorMessage("")
    setIsSubmitting(true)

    setTimeout(() => {
      if (candidate === "MOJAHID26") {
        localStorage.setItem("mojahid_access_granted", "MOJAHID26")
        localStorage.setItem("mojahid-ai:early-access", "true")
        setAccessGranted(true)
        setIsSubmitting(false)
        setTimeout(() => {
          router.push("/chat")
        }, 900)
      } else {
        setIsSubmitting(false)
        setErrorMessage("Invalid access code. Please check your invitation or contact hello@mojahidx.com")
      }
    }, 300)
  }

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("hello@mojahidx.com")
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2500)
  }

  return (
    <main className="relative min-h-[100dvh] w-full bg-[#F7F4EC] text-stone-900 selection:bg-[#F52929]/20 selection:text-[#F52929] overflow-x-hidden flex flex-col justify-between font-sans">
      {/* 21st.dev Animated Horizon Glow gradient background */}
      <HorizonGlow />

      {/* Floating Glass Navigation (Single clean brand logo, no duplicate text) */}
      <header className="relative z-10 w-full max-w-4xl mx-auto px-4 pt-4 sm:pt-6">
        <nav className="flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-full bg-white/80 backdrop-blur-xl border border-stone-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          {/* Brand Logo - Single clean Mojahid AI identity */}
          <div className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/Web_logo_light.svg" 
              alt="Mojahid AI" 
              className="h-7 sm:h-8 w-auto drop-shadow-xs" 
            />
          </div>

          {/* Status Badge */}
          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-50 border border-stone-200/80 text-stone-600 text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F52929] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F52929]" />
            </span>
            <span>Private VIP Preview</span>
          </div>

          {/* Right Action: Instagram & Contact */}
          <div className="flex items-center gap-2">
            <a
              href="https://instagram.com/heymojahid"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram @heymojahid"
              title="Follow @heymojahid on Instagram"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-100 hover:bg-stone-200 border border-stone-200/90 text-stone-700 hover:text-pink-600 transition-all shadow-2xs"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-500" />
              <span>@heymojahid</span>
            </a>

            <a
              href="mailto:hello@mojahidx.com"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-stone-950 hover:bg-stone-800 text-white transition-all shadow-xs cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-[#FB6A60]" />
              <span className="hidden sm:inline">hello@mojahidx.com</span>
              <span className="sm:hidden">Contact</span>
            </a>
          </div>
        </nav>
      </header>

      {/* Main Hero & Countdown Experience */}
      <section className="relative z-10 max-w-3xl mx-auto px-4 py-5 sm:py-8 text-center flex-1 flex flex-col justify-center items-center">
        {/* Glow Pill Announcement */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/90 border border-[#F52929]/30 text-[#D92020] text-[11px] sm:text-xs font-bold tracking-wide mb-3 sm:mb-4 shadow-[0_2px_14px_rgba(245,41,41,0.1)] backdrop-blur-md">
          <Sparkles className="w-3 h-3 text-[#F52929] animate-pulse" />
          <span>PUBLIC LAUNCH IN 7 DAYS</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-stone-950 mb-2 sm:mb-4 leading-[1.12]">
          The Horizon of{" "}
          <span className="bg-gradient-to-r from-[#D92020] via-[#F52929] to-[#FB6A60] bg-clip-text text-transparent">
            Multi-Model AI
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-stone-600 text-xs sm:text-sm md:text-base max-w-lg mx-auto mb-5 sm:mb-7 leading-relaxed font-normal px-2">
          Chat, compare, and reason with 300+ frontier AI models—GPT-4o, Claude 3.5, Gemini 2.5, DeepSeek R1, and Grok side-by-side.
        </p>

        {/* Architectural 7-Day Timepiece Countdown (Responsive) */}
        <div className="w-full max-w-xl mb-5 sm:mb-7">
          <div className="relative rounded-2xl sm:rounded-3xl bg-white/85 backdrop-blur-xl border border-stone-200/90 shadow-[0_16px_36px_-10px_rgba(245,41,41,0.12),0_2px_8px_rgba(0,0,0,0.02)] p-2.5 sm:p-5 overflow-hidden">
            <div className="grid grid-cols-4 divide-x divide-stone-200/80">
              {/* Days */}
              <div className="flex flex-col items-center justify-center px-1 sm:px-2 py-1">
                <span className="text-3xl sm:text-5xl md:text-6xl font-mono font-black text-stone-950 tracking-tight leading-none">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-stone-500 mt-1.5 sm:mt-2.5">
                  Days
                </span>
              </div>

              {/* Hours */}
              <div className="flex flex-col items-center justify-center px-1 sm:px-2 py-1">
                <span className="text-3xl sm:text-5xl md:text-6xl font-mono font-black text-stone-950 tracking-tight leading-none">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-stone-500 mt-1.5 sm:mt-2.5">
                  Hours
                </span>
              </div>

              {/* Minutes */}
              <div className="flex flex-col items-center justify-center px-1 sm:px-2 py-1">
                <span className="text-3xl sm:text-5xl md:text-6xl font-mono font-black text-stone-950 tracking-tight leading-none">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-stone-500 mt-1.5 sm:mt-2.5">
                  Minutes
                </span>
              </div>

              {/* Seconds */}
              <div className="flex flex-col items-center justify-center px-1 sm:px-2 py-1">
                <span className="text-3xl sm:text-5xl md:text-6xl font-mono font-black text-[#F52929] tracking-tight leading-none">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-[#F52929] mt-1.5 sm:mt-2.5">
                  Seconds
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Secret VIP Early Access Card (Code kept private) */}
        <div className="w-full max-w-lg mx-auto rounded-2xl sm:rounded-3xl bg-white/90 border border-stone-200/90 p-4 sm:p-6 backdrop-blur-xl shadow-[0_20px_45px_-10px_rgba(245,41,41,0.13),0_4px_16px_rgba(0,0,0,0.02)] relative overflow-hidden">
          {accessGranted ? (
            <div className="flex flex-col items-center text-center space-y-2.5 py-1">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-stone-900">VIP Access Verified</h2>
                <p className="text-xs text-stone-600 mt-0.5">
                  Your invitation pass is confirmed. Welcome to Mojahid AI.
                </p>
              </div>
              <button
                onClick={() => router.push("/chat")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#F52929] via-[#FB6A60] to-[#E11D48] hover:shadow-[0_6px_25px_rgba(245,41,41,0.35)] transition-all cursor-pointer text-xs sm:text-sm"
              >
                <span>Enter Mojahid AI Platform</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-left">
                  <div className="w-8 h-8 rounded-xl bg-[#F52929]/10 border border-[#F52929]/20 flex items-center justify-center text-[#F52929]">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-1.5">
                      Early Access Pass
                      <span className="text-[10px] font-bold bg-[#F52929]/10 text-[#F52929] px-2 py-0.5 rounded-full">
                        VIP
                      </span>
                    </h2>
                    <p className="text-[11px] text-stone-500">
                      Enter your invitation pass code to unlock the platform
                    </p>
                  </div>
                </div>
              </div>

              {/* Secure Access Code Input Form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault()
                  handleUnlock()
                }} 
                className="space-y-2.5"
              >
                <div className="relative flex flex-col sm:flex-row gap-2 bg-stone-100/90 p-1.5 rounded-xl sm:rounded-2xl border border-stone-200 focus-within:border-[#F52929] focus-within:ring-3 focus-within:ring-[#F52929]/15 transition-all">
                  <div className="relative flex-1 flex items-center pl-2.5">
                    <Lock className="w-4 h-4 text-stone-400 mr-2 flex-shrink-0" />
                    <input
                      type="text"
                      value={accessCode}
                      onChange={(e) => {
                        setAccessCode(e.target.value)
                        if (errorMessage) setErrorMessage("")
                      }}
                      placeholder="ENTER VIP ACCESS CODE"
                      className="w-full bg-transparent py-2 text-stone-900 placeholder-stone-400 focus:outline-none text-xs sm:text-sm font-mono uppercase tracking-wider font-bold"
                      autoComplete="off"
                      spellCheck="false"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !accessCode.trim()}
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg sm:rounded-xl font-bold text-white bg-gradient-to-r from-[#F52929] to-[#FB6A60] hover:from-[#E02020] hover:to-[#FA5A50] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer whitespace-nowrap text-xs sm:text-sm"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Verifying...
                      </span>
                    ) : (
                      <>
                        <span>Unlock</span>
                        <Unlock className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>

                {errorMessage && (
                  <div className="flex items-center gap-1.5 text-rose-700 text-[11px] bg-rose-50 border border-rose-200 px-3 py-2 rounded-lg text-left">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-rose-500" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="text-left text-[11px] text-stone-500 px-1 pt-0.5">
                  Need an early access pass? Inquire at <a href="mailto:hello@mojahidx.com" className="text-[#F52929] hover:underline font-semibold">hello@mojahidx.com</a>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Supported Models Bar */}
        <div className="mt-5 sm:mt-7 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-stone-500 font-medium">
          <span className="text-stone-400">Models:</span>
          {["GPT-4o", "Claude 3.5", "Gemini 2.5", "DeepSeek R1", "Grok 2"].map((model) => (
            <span 
              key={model} 
              className="px-2 py-0.5 rounded-full bg-white/80 border border-stone-200 shadow-2xs text-stone-700 font-semibold"
            >
              {model}
            </span>
          ))}
        </div>
      </section>

      {/* Refined Clean Footer */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto px-4 py-4 sm:py-5 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[11px] sm:text-xs text-stone-500">
        <div>
          © 2026 Mojahid AI. All rights reserved.
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://instagram.com/heymojahid"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-stone-600 hover:text-pink-600 font-semibold transition-colors"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-500" />
            <span>@heymojahid</span>
          </a>
          <span className="text-stone-300">•</span>
          <span>Inquiries:</span>
          <div className="inline-flex items-center gap-1 bg-white/90 border border-stone-200 rounded-full px-2.5 py-0.5 shadow-2xs">
            <span className="text-stone-800 font-mono font-semibold">hello@mojahidx.com</span>
            <button
              onClick={handleCopyEmail}
              className="p-1 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-800 transition-colors cursor-pointer"
              title="Copy Email"
            >
              {copiedEmail ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>
      </footer>
    </main>
  )
}
