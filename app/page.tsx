"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Lock, 
  Unlock, 
  Sparkles, 
  Mail, 
  Copy, 
  Check, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  AlertCircle 
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

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setIsSubmitting(true)

    const cleanedCode = accessCode.trim().toUpperCase()

    setTimeout(() => {
      if (cleanedCode === "MOJAHID26") {
        localStorage.setItem("mojahid_access_granted", "MOJAHID26")
        localStorage.setItem("mojahid-ai:early-access", "true")
        setAccessGranted(true)
        setIsSubmitting(false)
        // Auto-redirect to chat after a brief success animation
        setTimeout(() => {
          router.push("/chat")
        }, 1200)
      } else {
        setIsSubmitting(false)
        setErrorMessage("Invalid access code. Please try again or request access via email.")
      }
    }, 400)
  }

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("hello@mojahidx.com")
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2500)
  }

  return (
    <main className="min-h-screen bg-[#07070a] text-white selection:bg-orange-500/30 selection:text-orange-200 relative overflow-hidden flex flex-col justify-between font-sans">
      {/* Ambient background glows */}
      <div 
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-orange-600/20 via-amber-600/10 to-transparent blur-[140px] rounded-full" 
        aria-hidden="true" 
      />
      <div 
        className="pointer-events-none absolute -bottom-40 right-10 w-[500px] h-[500px] bg-gradient-to-t from-rose-600/15 via-orange-600/10 to-transparent blur-[140px] rounded-full" 
        aria-hidden="true" 
      />
      <div 
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-70" 
        aria-hidden="true" 
      />

      {/* Top Navigation */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/Web_logo.svg" 
            alt="Mojahid AI Logo" 
            className="h-10 md:h-12 w-auto drop-shadow-[0_0_12px_rgba(249,115,22,0.4)]" 
          />
          <span className="font-extrabold tracking-wider text-xl md:text-2xl uppercase bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            MOJAHID AI
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="mailto:hello@mojahidx.com"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-medium bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition-all backdrop-blur-sm"
          >
            <Mail className="w-4 h-4 text-orange-400" />
            <span className="hidden sm:inline">hello@mojahidx.com</span>
            <span className="sm:hidden">Contact</span>
          </a>
        </div>
      </header>

      {/* Hero & Countdown Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-8 md:py-14 text-center flex-1 flex flex-col justify-center items-center">
        {/* Launching Soon Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-400 text-xs md:text-sm font-medium tracking-wide mb-6 shadow-[0_0_20px_rgba(249,115,22,0.15)] animate-pulse">
          <span className="w-2 h-2 rounded-full bg-orange-500" />
          <span>OFFICIAL LAUNCH IN PROGRESS • 7 DAYS COUNTDOWN</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
          The Next Generation of{" "}
          <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-rose-500 bg-clip-text text-transparent">
            Multi-Model AI
          </span>{" "}
          is Launching Soon
        </h1>

        <p className="text-neutral-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Chat, compare, and reason across 300+ frontier AI models—OpenAI, Google Gemini, Anthropic Claude, Perplexity, DeepSeek, and Grok—side-by-side in one unified workspace.
        </p>

        {/* 7 Days Countdown Timer */}
        <div className="grid grid-cols-4 gap-3 sm:gap-5 md:gap-6 w-full max-w-2xl mb-12">
          {/* Days */}
          <div className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-2xl relative group overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-orange-500 to-amber-500 opacity-60" />
            <span className="text-3xl sm:text-5xl md:text-6xl font-mono font-bold text-white tracking-tight">
              {String(timeLeft.days).padStart(2, "0")}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-neutral-400 mt-2">
              Days
            </span>
          </div>

          {/* Hours */}
          <div className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-2xl relative group overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 opacity-60" />
            <span className="text-3xl sm:text-5xl md:text-6xl font-mono font-bold text-white tracking-tight">
              {String(timeLeft.hours).padStart(2, "0")}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-neutral-400 mt-2">
              Hours
            </span>
          </div>

          {/* Minutes */}
          <div className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-2xl relative group overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-orange-500 to-rose-500 opacity-60" />
            <span className="text-3xl sm:text-5xl md:text-6xl font-mono font-bold text-white tracking-tight">
              {String(timeLeft.minutes).padStart(2, "0")}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-neutral-400 mt-2">
              Minutes
            </span>
          </div>

          {/* Seconds */}
          <div className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-2xl relative group overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-rose-500 to-orange-500 opacity-60" />
            <span className="text-3xl sm:text-5xl md:text-6xl font-mono font-bold text-orange-400 tracking-tight">
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-neutral-400 mt-2">
              Seconds
            </span>
          </div>
        </div>

        {/* Access Code VIP Gate Card */}
        <div className="w-full max-w-xl mx-auto rounded-3xl bg-neutral-900/70 border border-neutral-800 p-6 sm:p-8 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          {accessGranted ? (
            <div className="flex flex-col items-center text-center space-y-4 py-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-[0_0_24px_rgba(16,185,129,0.25)]">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">VIP Access Granted</h2>
              <p className="text-sm text-neutral-400 max-w-sm">
                Your access code <code className="text-emerald-400 font-mono font-semibold">MOJAHID26</code> is validated. You have full instant access to Mojahid AI.
              </p>
              <button
                onClick={() => router.push("/chat")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 hover:from-orange-500 hover:to-rose-500 transition-all shadow-[0_0_25px_rgba(249,115,22,0.4)] cursor-pointer"
              >
                <span>Enter Mojahid AI Platform</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-left">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-center text-orange-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      VIP Early Access Gate
                      <Sparkles className="w-4 h-4 text-amber-400" />
                    </h2>
                    <p className="text-xs text-neutral-400">
                      Enter your VIP code to access the platform right now
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleUnlock} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={accessCode}
                      onChange={(e) => {
                        setAccessCode(e.target.value)
                        if (errorMessage) setErrorMessage("")
                      }}
                      placeholder='Enter access code (e.g. MOJAHID26)'
                      className="w-full px-4 py-3.5 rounded-xl bg-black/60 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm font-mono uppercase tracking-wider transition-all"
                      autoComplete="off"
                      spellCheck="false"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !accessCode.trim()}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 hover:from-orange-500 hover:to-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] cursor-pointer whitespace-nowrap text-sm"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Verifying...
                      </span>
                    ) : (
                      <>
                        <span>Unlock Access</span>
                        <Unlock className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {errorMessage && (
                  <div className="flex items-center gap-2 text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg text-left">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
                  <span>Authorized code: <strong className="text-orange-400/90 font-mono">MOJAHID26</strong></span>
                  <button
                    type="button"
                    onClick={() => setAccessCode("MOJAHID26")}
                    className="text-orange-400 hover:text-orange-300 underline cursor-pointer"
                  >
                    Auto-fill Code
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Contact & Inquiries Pill */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-neutral-400">
          <span>Need custom enterprise access or have questions?</span>
          <div className="inline-flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded-full px-3 py-1">
            <span className="text-neutral-300 font-mono">hello@mojahidx.com</span>
            <button
              onClick={handleCopyEmail}
              className="p-1 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Copy Email"
            >
              {copiedEmail ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
        <div>
          © 2026 Mojahid AI. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <a href="mailto:hello@mojahidx.com" className="hover:text-neutral-300 transition-colors">
            hello@mojahidx.com
          </a>
          <span className="text-neutral-800">•</span>
          <span className="text-neutral-600">VIP Access: MOJAHID26</span>
        </div>
      </footer>
    </main>
  )
}
