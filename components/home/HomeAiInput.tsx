"use client";

import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { 
  Globe, 
  Paperclip, 
  ArrowUp, 
  Loader2, 
  X, 
  Mic, 
  MicOff, 
  Sparkles, 
  FileText,
  ChevronDown 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import Image from "next/image";

interface Props {
  onSubmit?: (text: string) => void;
  isDark?: boolean;
  // When provided, replaces the Search toggle with a model selector button
  modelSelectorLabel?: string;
  onOpenModelSelector?: () => void;
  // For edit functionality
  initialValue?: string;
  onClear?: () => void;
}

const MIN_HEIGHT = 44;
const MAX_HEIGHT = 180;

export default function HomeAiInput({
  onSubmit,
  isDark = true,
  modelSelectorLabel,
  onOpenModelSelector,
  initialValue,
  onClear,
}: Props) {
  const [value, setValue] = useState(initialValue || "");
  const [showSearch, setShowSearch] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [attachmentErrorMsg, setAttachmentErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Speech recognition
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setValue(transcript);
      adjustHeight();
    }
  }, [transcript]);

  // Update value when initialValue changes (for edit functionality)
  useEffect(() => {
    if (initialValue !== undefined) {
      setValue(initialValue);
      adjustHeight();
    }
  }, [initialValue]);

  const startListening = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }
    if (!isMicrophoneAvailable) {
      alert("Microphone access is required for speech recognition.");
      return;
    }
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: "en-US" });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const adjustHeight = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const newHeight = Math.min(Math.max(ta.scrollHeight, MIN_HEIGHT), MAX_HEIGHT);
    ta.style.height = `${newHeight}px`;
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  useEffect(
    () => () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    },
    [imagePreview],
  );

  const handleRemoveAttachment = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setAttachedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;

    // Allowed: images, txt, pdf, doc, docx
    const allowed = [
      /^image\//,
      /^text\/plain$/,
      /^application\/pdf$/,
      /^application\/msword$/,
      /^application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document$/,
    ];
    const isAllowed = allowed.some((re) => re.test(file.type));
    if (!isAllowed) {
      setAttachmentErrorMsg("Unsupported file. Allowed: Images, TXT, PDF, DOC, DOCX.");
      setTimeout(() => setAttachmentErrorMsg(null), 4000);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setAttachedFile(file);
    if (file.type.startsWith("image/")) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleSend = () => {
    const text = value.trim();
    if (!text && !attachedFile) return;
    if (listening) setTimeout(() => stopListening(), 100);

    if (onSubmit) {
      onSubmit(text);
    }

    setValue("");
    setAttachedFile(null);
    setImagePreview(null);
    onClear?.();
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = `${MIN_HEIGHT}px`;
        textareaRef.current.focus();
      }
    });
  };

  // Prompt Enhancer (calls /api/enhance-prompt)
  const enhancePrompt = async () => {
    const text = value.trim();
    if (!text || isEnhancing) return;
    if (listening) setTimeout(() => stopListening(), 100);
    setIsEnhancing(true);
    try {
      const res = await fetch("/api/enhance-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });
      if (!res.ok) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const err = await res.json().catch(() => ({}) as any);
        throw new Error(err?.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data?.enhancedPrompt) {
        setValue(data.enhancedPrompt);
      }
    } catch (e) {
      console.error("Enhance failed", e);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-1 sm:px-2">
      <div
        className={cn(
          "w-full rounded-2xl sm:rounded-3xl border transition-all duration-200 overflow-hidden shadow-xl backdrop-blur-xl",
          isDark
            ? "bg-neutral-900/95 border-neutral-800 text-white shadow-[0_12px_40px_rgba(0,0,0,0.5)] focus-within:border-red-500/60 focus-within:ring-2 focus-within:ring-red-500/20"
            : "bg-white/95 border-stone-200 text-stone-900 shadow-[0_12px_32px_rgba(0,0,0,0.08)] focus-within:border-red-500/60 focus-within:ring-2 focus-within:ring-red-500/20"
        )}
      >
        {/* Attachment Previews */}
        {imagePreview && (
          <div className="p-3 pb-0 flex items-center">
            <div className="relative h-20 w-20 rounded-xl overflow-hidden border border-neutral-700 shadow-sm">
              <Image
                className="object-cover h-full w-full"
                src={imagePreview}
                height={160}
                width={160}
                alt="attached image"
              />
              <button
                type="button"
                onClick={handleRemoveAttachment}
                className="cursor-pointer absolute top-1 right-1 inline-flex items-center justify-center h-5 w-5 rounded-full bg-black/80 text-white hover:bg-black border border-white/20"
                aria-label="Remove image"
                title="Remove image"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {attachedFile && !imagePreview && (
          <div className="px-3.5 pt-3 pb-0 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5">
              <FileText className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="truncate text-xs text-neutral-200 font-medium" title={attachedFile.name}>
                {attachedFile.name}
              </span>
              <span className="text-[10px] text-neutral-400 flex-shrink-0">
                {Math.max(1, Math.round(attachedFile.size / 1024))} KB
              </span>
            </div>
            <button
              type="button"
              onClick={handleRemoveAttachment}
              className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/10"
              aria-label="Remove file"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {attachmentErrorMsg && (
          <div className="px-3.5 py-1.5 text-xs text-red-300 bg-red-950/60 border-b border-red-800/40">
            {attachmentErrorMsg}
          </div>
        )}

        {/* Full-width responsive textarea */}
        <div className="w-full px-3.5 pt-3 pb-1 sm:px-4 sm:pt-3.5">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                // Submit with Enter on desktop, allow multiline on narrow mobile touchscreens
                if (typeof window !== "undefined" && window.innerWidth >= 640) {
                  e.preventDefault();
                  handleSend();
                }
              }
            }}
            placeholder={showSearch ? "Search the web with AI..." : "Ask Mojahid AI anything..."}
            className={cn(
              "w-full border-none resize-none focus:outline-none focus-visible:outline-none p-0 text-sm sm:text-base leading-relaxed bg-transparent",
              isDark 
                ? "text-white placeholder:text-neutral-400" 
                : "text-stone-900 placeholder:text-stone-400"
            )}
            rows={1}
            style={{ minHeight: `${MIN_HEIGHT}px`, maxHeight: `${MAX_HEIGHT}px` }}
          />
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center justify-between px-3 pb-2.5 pt-1 sm:px-4 sm:pb-3 gap-2">
          {/* Left Actions: Model Selector + Tools */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap min-w-0">
            {modelSelectorLabel && onOpenModelSelector && (
              <button
                type="button"
                onClick={onOpenModelSelector}
                className={cn(
                  "cursor-pointer rounded-full transition-all inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 h-7 sm:h-8 text-xs font-semibold max-w-[130px] sm:max-w-[180px] truncate",
                  isDark
                    ? "bg-white/10 hover:bg-white/15 text-neutral-200 border border-white/10"
                    : "bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200"
                )}
                aria-label="Choose model"
                title="Choose model"
              >
                <span className="truncate">{modelSelectorLabel}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70 flex-shrink-0" />
              </button>
            )}

            {/* Attach File */}
            <label
              title="Attach file"
              className={cn(
                "cursor-pointer rounded-full p-1.5 sm:p-2 transition-all flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8",
                attachedFile
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : isDark
                    ? "text-neutral-400 hover:text-white hover:bg-white/10"
                    : "text-stone-500 hover:text-stone-900 hover:bg-stone-100"
              )}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                aria-label="Attach file"
              />
              <Paperclip className="w-4 h-4" />
            </label>

            {/* Search Web Toggle */}
            <button
              type="button"
              onClick={() => setShowSearch((s) => !s)}
              className={cn(
                "cursor-pointer rounded-full p-1.5 sm:p-2 transition-all flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8",
                showSearch
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : isDark
                    ? "text-neutral-400 hover:text-white hover:bg-white/10"
                    : "text-stone-500 hover:text-stone-900 hover:bg-stone-100"
              )}
              title={showSearch ? "Web search enabled" : "Enable web search"}
              aria-pressed={showSearch}
            >
              <Globe className="w-4 h-4" />
            </button>

            {/* Enhance prompt */}
            <button
              type="button"
              onClick={enhancePrompt}
              disabled={isEnhancing || !value.trim()}
              className={cn(
                "cursor-pointer rounded-full p-1.5 sm:p-2 transition-all flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 disabled:opacity-30 disabled:cursor-not-allowed",
                isEnhancing
                  ? "bg-red-500/20 text-red-400"
                  : isDark
                    ? "text-neutral-400 hover:text-white hover:bg-white/10"
                    : "text-stone-500 hover:text-stone-900 hover:bg-stone-100"
              )}
              title="Enhance prompt with AI"
              aria-label="Enhance prompt"
            >
              {isEnhancing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Right Actions: Voice + Prominent Send Button */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            {/* Mic */}
            {browserSupportsSpeechRecognition && (
              <button
                type="button"
                onClick={listening ? stopListening : startListening}
                className={cn(
                  "cursor-pointer rounded-full p-1.5 sm:p-2 transition-all flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8",
                  listening
                    ? "bg-red-500 text-white animate-pulse"
                    : isDark
                      ? "text-neutral-400 hover:text-white hover:bg-white/10"
                      : "text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                )}
                aria-label={listening ? "Stop voice input" : "Start voice input"}
                title={listening ? "Stop recording" : "Voice input"}
              >
                {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}

            {/* Prominent Send Button (Mobile & Desktop) */}
            <button
              type="button"
              onClick={handleSend}
              disabled={!value.trim() && !attachedFile}
              className={cn(
                "h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm",
                value.trim() || attachedFile
                  ? "bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 shadow-red-500/25"
                  : isDark
                    ? "bg-white/10 text-neutral-500 cursor-not-allowed"
                    : "bg-stone-200 text-stone-400 cursor-not-allowed"
              )}
              aria-label="Send message"
              title="Send message"
            >
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
