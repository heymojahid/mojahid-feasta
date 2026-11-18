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
  Layers,
  Zap
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
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleUnlock = (codeToTest?: string) => {
    const candidate = (codeToTest || accessCode).trim().toUpperCase()
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
        }, 1100)
      } else {
        setIsSubmitting(false)
        setErrorMessage("Invalid access code. Use 'MOJAHID26' or contact hello@mojahidx.com")
      }
    }, 300)
  }

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("hello@mojahidx.com")
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2500)
  }

  return (
    <main className="min-h-screen text-stone-900 selection:bg-[#F52929]/20 selection:text-[#F52929] relative overflow-hidden flex flex-col justify-between font-sans">
      {/* 21st.dev Animated Horizon Glow gradient background */}
      <HorizonGlow />

      {/* Top Floating Glass Navigation */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-4 pt-6 sm:pt-8">
        <nav className="flex items-center justify-between px-4 sm:px-6 py-3 rounded-full bg-white/70 backdrop-blur-xl border border-stone-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/Web_logo.svg" 
              alt="Mojahid AI Logo" 
              className="h-8 sm:h-9 w-auto drop-shadow-[0_2px_10px_rgba(245,41,41,0.3)]" 
            />
            <div className="flex flex-col">
              <span className="font-extrabold tracking-wider text-base sm:text-lg uppercase text-stone-950 leading-tight">
                MOJAHID AI
              </span>
              <span className="text-[10px] font-semibold text-stone-400 tracking-widest uppercase">
                Horizon Edition
              </span>
            </div>
          </div>

          {/* Center Pill: Status */}
          <div className="hidden md:inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 border border-stone-200 text-stone-600 text-xs font-semibold shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F52929] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F52929]" />
            </span>
            <span>Private VIP Preview</span>
          </div>

          {/* Right Action: Contact */}
          <div className="flex items-center gap-2">
            <a
              href="mailto:hello@mojahidx.com"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-stone-900 hover:bg-stone-800 text-white transition-all shadow-sm cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-[#FB6A60]" />
              <span className="hidden sm:inline">hello@mojahidx.com</span>
              <span className="sm:hidden">Contact</span>
            </a>
          </div>
        </nav>
      </header>

      {/* Main Hero & Countdown Experience */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-10 text-center flex-1 flex flex-col justify-center items-center">
        {/* Glow Pill Announcement */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#F52929]/30 text-[#D92020] text-xs sm:text-sm font-bold tracking-wide mb-6 shadow-[0_4px_24px_rgba(245,41,41,0.12)] backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#F52929] animate-pulse" />
          <span>OFFICIAL PUBLIC LAUNCH IN 7 DAYS</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] font-black tracking-tight text-stone-950 mb-5 leading-[1.08]">
          The Horizon of{" "}
          <span className="bg-gradient-to-r from-[#D92020] via-[#F52929] to-[#FB6A60] bg-clip-text text-transparent">
            Multi-Model AI
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-stone-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          One unified interface for 300+ frontier models. Chat, brainstorm, and compare GPT-4o, Claude 3.5, Gemini 2.5, DeepSeek R1, and Grok side-by-side.
        </p>

        {/* Architectural 7-Day Timepiece Countdown */}
        <div className="w-full max-w-2xl mb-10">
          <div className="relative rounded-3xl bg-white/80 backdrop-blur-xl border border-stone-200/90 shadow-[0_24px_50px_-12px_rgba(245,41,41,0.12),0_4px_16px_rgba(0,0,0,0.03)] p-4 sm:p-7 overflow-hidden">
            {/* Subtle ambient gradient bar at top and bottom */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#F52929]/20 via-[#FB6A60]/40 to-[#FDA096]/20" />
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#FDA096]/20 via-[#FB6A60]/40 to-[#F52929]/20" />

            <div className="grid grid-cols-4 divide-x divide-stone-200/80">
              {/* Days */}
              <div className="flex flex-col items-center justify-center px-2 py-1">
                <span className="text-4xl sm:text-6xl md:text-7xl font-mono font-black text-stone-900 tracking-tight leading-none">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-stone-500 mt-3">
                  Days
                </span>
              </div>

              {/* Hours */}
              <div className="flex flex-col items-center justify-center px-2 py-1">
                <span className="text-4xl sm:text-6xl md:text-7xl font-mono font-black text-stone-900 tracking-tight leading-none">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-stone-500 mt-3">
                  Hours
                </span>
              </div>

              {/* Minutes */}
              <div className="flex flex-col items-center justify-center px-2 py-1">
                <span className="text-4xl sm:text-6xl md:text-7xl font-mono font-black text-stone-900 tracking-tight leading-none">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-stone-500 mt-3">
                  Minutes
                </span>
              </div>

              {/* Seconds */}
              <div className="flex flex-col items-center justify-center px-2 py-1">
                <span className="text-4xl sm:text-6xl md:text-7xl font-mono font-black text-[#F52929] tracking-tight leading-none">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#F52929]/80 mt-3">
                  Seconds
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* VIP Early Access Card */}
        <div className="w-full max-w-xl mx-auto rounded-3xl bg-white/90 border border-stone-200/90 p-5 sm:p-7 backdrop-blur-xl shadow-[0_25px_60px_-10px_rgba(245,41,41,0.14),0_6px_20px_rgba(0,0,0,0.03)] relative overflow-hidden">
          {accessGranted ? (
            <div className="flex flex-col items-center text-center space-y-3 py-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.25)]">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-stone-900">VIP Access Active</h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  Access code <code className="text-emerald-600 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">MOJAHID26</code> verified.
                </p>
              </div>
              <button
                onClick={() => router.push("/chat")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#F52929] via-[#FB6A60] to-[#E11D48] hover:shadow-[0_8px_30px_rgba(245,41,41,0.4)] transition-all cursor-pointer text-sm"
              >
                <span>Enter Mojahid AI Platform</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-left">
                  <div className="w-9 h-9 rounded-xl bg-[#F52929]/10 border border-[#F52929]/20 flex items-center justify-center text-[#F52929]">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-1.5">
                      Early Access Pass
                      <span className="text-[10px] font-semibold bg-[#F52929]/10 text-[#F52929] px-2 py-0.5 rounded-full">
                        VIP
                      </span>
                    </h2>
                    <p className="text-xs text-stone-500">
                      Enter access code to bypass countdown and enter right now
                    </p>
                  </div>
                </div>
              </div>

              {/* Integrated Access Code Input Form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault()
                  handleUnlock()
                }} 
                className="space-y-3"
              >
                <div className="relative flex flex-col sm:flex-row gap-2 bg-stone-100/90 p-1.5 rounded-2xl border border-stone-200 focus-within:border-[#F52929] focus-within:ring-4 focus-within:ring-[#F52929]/15 transition-all">
                  <div className="relative flex-1 flex items-center pl-3">
                    <Lock className="w-4 h-4 text-stone-400 mr-2 flex-shrink-0" />
                    <input
                      type="text"
                      value={accessCode}
                      onChange={(e) => {
                        setAccessCode(e.target.value)
                        if (errorMessage) setErrorMessage("")
                      }}
                      placeholder="ENTER CODE (E.G. MOJAHID26)"
                      className="w-full bg-transparent py-2.5 text-stone-900 placeholder-stone-400 focus:outline-none text-sm font-mono uppercase tracking-widest font-semibold"
                      autoComplete="off"
                      spellCheck="false"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !accessCode.trim()}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#F52929] to-[#FB6A60] hover:from-[#E02020] hover:to-[#FA5A50] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_4px_16px_rgba(245,41,41,0.3)] cursor-pointer whitespace-nowrap text-sm"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
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
                  <div className="flex items-center gap-2 text-rose-700 text-xs bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl text-left">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Auto-fill Helper */}
                <div className="flex items-center justify-between text-xs text-stone-500 px-1">
                  <span>Pass code: <strong className="text-[#F52929] font-mono font-bold">MOJAHID26</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      setAccessCode("MOJAHID26")
                      handleUnlock("MOJAHID26")
                    }}
                    className="text-[#F52929] hover:underline font-semibold cursor-pointer inline-flex items-center gap-1"
                  >
                    <Zap className="w-3 h-3 fill-current" />
                    Apply & Enter Instantly
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Supported Models Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-[11px] text-stone-500 font-medium">
          <span className="text-stone-400">Supported:</span>
          {["OpenAI GPT-4o", "Claude 3.5 Sonnet", "Gemini 2.5 Pro", "DeepSeek R1", "Grok 2"].map((model) => (
            <span 
              key={model} 
              className="px-2.5 py-0.5 rounded-full bg-white/70 border border-stone-200 shadow-2xs backdrop-blur-xs text-stone-700"
            >
              {model}
            </span>
          ))}
        </div>
      </section>

      {/* Refined Footer */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto px-6 py-6 border-t border-stone-200/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
        <div>
          © 2026 Mojahid AI. All rights reserved.
        </div>

        <div className="flex items-center gap-3">
          <span>Inquiries:</span>
          <div className="inline-flex items-center gap-1 bg-white/80 border border-stone-200 rounded-full px-2.5 py-0.5 shadow-2xs">
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
