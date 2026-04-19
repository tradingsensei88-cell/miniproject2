"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Keyboard, getCharFromKeyCode } from "@/components/ui/keyboard";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import OrbitingCircles from "@/components/ui/orbiting-circles";
import GlassSurface from "@/components/ui/glass-surface";
import ScrollSequence from "@/components/ui/ScrollSequence";
import AriaCard from "@/components/aria-card";

import PremiumFooter from "@/components/ui/premium-footer";
import { useRouter } from "next/navigation";
import Link from "next/link";

type ChatMessage = { role: "user" | "assistant"; content: string };

const SplineScene = dynamic(() => import("@/components/ui/SplineScene"), {
  ssr: false,
  loading: () => <div className="spline-loading" />,
});

const SPLINE_SCENE = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

const navItems = [
  { name: "Home", link: "/" },
  { name: "Upload", link: "/upload" },
  { name: "About", link: "/about" },
];

export default function Home() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [keyboardAnimating, setKeyboardAnimating] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef<() => void>(undefined);

  // Drag State
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setDragOffset({
      x: e.clientX - dragStartPos.current.x,
      y: e.clientY - dragStartPos.current.y
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleChatSubmit = async () => {
    if (!searchText.trim() || isLoading) return;
    const newMsg: ChatMessage = { role: "user", content: searchText.trim() };
    setMessages((prev) => [...prev, newMsg]);
    setSearchText("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, newMsg] }),
      });
      const data = await res.json();
      if (data.error) {
        setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${data.error}` }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
      }
    } catch (err: any) {
      setMessages((prev) => [...prev, { role: "assistant", content: `Connection anomaly detected. Secure linkage failed.` }]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    submitRef.current = handleChatSubmit;
  });

  // Handle on-screen keyboard key presses
  const handleKeyPress = useCallback((keyCode: string) => {
    if (keyCode === "Backspace") {
      setSearchText((prev) => prev.slice(0, -1));
      return;
    }
    if (keyCode === "Enter") {
      if (submitRef.current) submitRef.current();
      return;
    }
    if (
      keyCode.startsWith("Shift") ||
      keyCode.startsWith("Control") ||
      keyCode.startsWith("Alt") ||
      keyCode.startsWith("Meta") ||
      keyCode.startsWith("Caps") ||
      keyCode.startsWith("Tab") ||
      keyCode.startsWith("Escape") ||
      (keyCode.startsWith("F") && keyCode.length <= 3) ||
      keyCode === "Fn" ||
      keyCode.startsWith("Arrow")
    ) {
      return;
    }
    const char = getCharFromKeyCode(keyCode);
    if (char) setSearchText((prev) => prev + char);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleFocus = () => {
    if (!showKeyboard) {
      setShowKeyboard(true);
      setKeyboardAnimating(true);
    }
  };

  const handleDismissKeyboard = () => {
    setKeyboardAnimating(false);
    setTimeout(() => setShowKeyboard(false), 300);
    inputRef.current?.blur();
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = searchText;
    }
  }, [searchText]);

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
        }

        html, body {
          background: #000;
          color: #fff;
        }

        @keyframes subtle-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .thought-cloud { animation: subtle-float 4s ease-in-out infinite; }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .glass-card {
          width: 320px;
          height: 440px;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(24px) saturate(1.5);
          -webkit-backdrop-filter: blur(24px) saturate(1.5);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08) inset, 0 32px 64px rgba(0, 0, 0, 0.5), 0 0 60px rgba(255, 255, 255, 0.05);
          position: absolute;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .glass-card::before {
          content: '';
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), rgba(255,255,255,0.1), transparent);
          z-index: 1;
        }

        .msg-user {
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          align-self: flex-end;
          margin-left: auto;
          margin-right: 4px;
          border-radius: 12px 3px 12px 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
        }
        .msg-bot {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: rgba(255, 255, 255, 0.9);
          align-self: flex-start;
          margin-left: 4px;
          border-radius: 3px 12px 12px 12px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 0.8rem;
          letter-spacing: 0;
          backdrop-filter: blur(10px);
        }

        @keyframes blink { 0%,80%,100%{opacity:0.4} 40%{opacity:1} }
        .typing-dot { display:inline-block; width:4px; height:4px; border-radius:50%; background:rgba(255,255,255,0.6); animation:blink 1.2s infinite; }
        .typing-dot:nth-child(2){animation-delay:0.2s}
        .typing-dot:nth-child(3){animation-delay:0.4s}

        .chat-input-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 14px 14px;
          background: rgba(255, 255, 255, 0.05);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          flex-shrink: 0;
          backdrop-filter: blur(10px);
        }

        .chat-input {
          flex: 1;
          height: 40px;
          min-width: 0;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 10px;
          outline: none;
          color: #fff;
          font-size: 0.8rem;
          font-weight: 400;
          padding: 0 12px;
          transition: all 0.2s ease;
          caret-color: #fff;
          backdrop-filter: blur(10px);
        }
        .chat-input::placeholder { color: rgba(255, 255, 255, 0.4); }
        .chat-input:focus {
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.12);
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.08);
        }

        .chat-send-btn {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
        }
        .chat-send-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.35);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }
        .chat-send-btn:active:not(:disabled) { transform: scale(0.95); }
        .chat-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
      <div className="hero-wrapper">
        {/* Black Background */}
        <div className="absolute inset-0 bg-black z-0" />
        
        {/* Glowing Semicircle Arch */}
        <div className="hero-ring-wrapper">
          <div className="hero-ring" />
        </div>
        
        {/* Spline 3D Background */}
        <div className="spline-bg relative z-[2]">
          <SplineScene scene={SPLINE_SCENE} className="spline-fullscreen" renderOnDemand={false} />
        </div>

        {/* Subtle Ask Cloud */}
        {!showKeyboard && (
          <div 
            className="absolute z-30 cursor-pointer thought-cloud"
            style={{ top: '10%', left: 'calc(50% + 60px)', transform: 'translateX(-50%)' }}
            onClick={() => { setShowKeyboard(true); setKeyboardAnimating(true); }}
          >
            <div className="relative hover:opacity-80 transition-opacity duration-300">
              <img 
                src="/cloud.png" 
                alt="Ask Cloud" 
                className="w-[140px] h-auto drop-shadow-lg pointer-events-none" 
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
                <span className="text-white font-semibold text-base -translate-y-3">Ask me ?</span>
              </div>
            </div>
          </div>
        )}

        {/* Grid Overlay */}
        <div className="grid-overlay" />

        {/* Content Card — Left */}
        <div className="absolute top-32 left-8 z-10 hidden xl:block">
          <AriaCard />
        </div>

        {/* Orbiting Elements — Right */}
        <div className="absolute top-24 right-16 w-[280px] h-[280px] z-10 hidden lg:flex items-center justify-center pointer-events-none opacity-70">
          <OrbitingCircles radius={60} duration={20} delay={0} path>
            <div className="flex bg-black/60 backdrop-blur items-center justify-center w-12 h-12 rounded-[8px] border border-black/20 z-10">
              <img src="/pdf.png" alt="PDF" className="w-6 h-6 object-contain" />
            </div>
          </OrbitingCircles>
          <OrbitingCircles radius={60} duration={20} delay={10} path>
            <div className="flex bg-black/60 backdrop-blur items-center justify-center w-12 h-12 rounded-[8px] border border-black/20">
              <img src="/word.png" alt="Word" className="w-6 h-6 object-contain" />
            </div>
          </OrbitingCircles>

          <OrbitingCircles radius={120} duration={30} delay={15} direction="counter-clockwise" path>
            <div className="flex bg-black/60 backdrop-blur items-center justify-center w-14 h-14 rounded-[8px] border border-black/20">
              <img src="/drive.png" alt="Drive" className="w-8 h-8 object-contain" />
            </div>
          </OrbitingCircles>
          <OrbitingCircles radius={120} duration={30} delay={0} direction="counter-clockwise" path>
            <div className="flex bg-black/60 backdrop-blur items-center justify-center w-14 h-14 rounded-[8px] border border-black/20">
              <img src="/github.png" alt="GitHub" className="w-8 h-8 object-contain" />
            </div>
          </OrbitingCircles>
        </div>
      </div>

      <ScrollSequence frameCount={144} pathPrefix="/video/" />

      <PremiumFooter />

      {/* Resizable Navbar */}
      <Navbar>
        {/* Desktop */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-3">
            <NavbarButton variant="primary" href="/upload">
              Get Started
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>
          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-sm"
                style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}
              >
                {item.name}
              </a>
            ))}
            <NavbarButton
              variant="primary"
              className="w-full"
              href="/upload"
            >
              Upload Manual
            </NavbarButton>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* ── Chat Widget ── */}
      {showKeyboard && (
        <div
          id="chat-widget"
          className={`glass-card fixed z-[200] ${
            isDragging ? "" : "transition-all duration-300 ease-out"
          } ${keyboardAnimating ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          style={{
            top: '10%',
            left: 'calc(50% + 170px)',
            transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
          }}
        >
          {/* ── Header ── */}
          <div
            className="relative flex items-center justify-between px-5 py-4 cursor-move select-none"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {/* Status dot */}
            <div className="flex items-center gap-2">
              <span
                style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#4ade80",
                  boxShadow: "0 0 12px rgba(74, 222, 128, 0.6)",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              <span className="text-[11px] font-medium text-white/60">Connected</span>
            </div>

            {/* Drag pill */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                width: 28, height: 3,
                borderRadius: 2,
                background: "rgba(255,255,255,0.15)",
              }}
            />

            {/* Close button */}
            <button
              style={{
                width: 28, height: 28,
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.8)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
                transition: "all 0.15s",
                backdropFilter: "blur(10px)",
              }}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={handleDismissKeyboard}
              aria-label="Close Chat"
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(255,100,100,0.2)";
                e.currentTarget.style.borderColor = "rgba(255,100,100,0.4)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ── Messages ── */}
          <div
            className="flex-1 overflow-y-auto flex flex-col gap-2.5"
            ref={scrollRef}
            style={{ padding: "12px 12px" }}
          >
            {messages.length === 0 && (
              <div style={{ margin: "auto", textAlign: "center", color: "rgba(255,255,255,0.35)", fontSize: "0.8rem", lineHeight: 1.6 }}>
                <div style={{ fontSize: "1.2rem", marginBottom: 8 }}>✦</div>
                Start typing...
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "user" ? "msg-user" : "msg-bot"}
                style={{ maxWidth: "88%", padding: "8px 11px", fontSize: "0.78rem", lineHeight: 1.5 }}
              >
                {m.content}
              </div>
            ))}
            {isLoading && (
              <div className="msg-bot" style={{ padding: "9px 12px", display: "flex", gap: 3.5, alignItems: "center" }}>
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            )}
          </div>

          {/* ── Input Bar ── */}
          <div
            className="chat-input-bar"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <input
              ref={inputRef}
              type="text"
              className="chat-input"
              placeholder="Type message..."
              value={searchText}
              onChange={handleInputChange}
              onKeyDown={(e) => { if (e.key === "Enter") handleChatSubmit(); }}
              autoFocus
            />
            <button
              className="chat-send-btn"
              onClick={handleChatSubmit}
              disabled={isLoading || !searchText.trim()}
              aria-label="Send"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Docked Virtual Keyboard */}
      {showKeyboard && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] transition-all duration-300 ease-out pointer-events-none flex flex-col items-center justify-center gap-2 ${
            keyboardAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
            <button
               onClick={handleDismissKeyboard}
               className="pointer-events-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-black/50 hover:bg-black backdrop-blur-xl border border-white/20 text-white/90 hover:text-white transition-all text-[0.75rem] uppercase tracking-wide font-semibold shadow-2xl"
            >
               Hide Keyboard
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
               </svg>
            </button>
            <div className="keyboard-glass mx-auto rounded-3xl border border-white/15 shadow-2xl bg-black/40 backdrop-blur-xl p-4 transform scale-[0.95] origin-bottom pointer-events-auto">
               <Keyboard enableSound onKeyPress={handleKeyPress} />
            </div>
        </div>
      )}
    </>
  );
}
