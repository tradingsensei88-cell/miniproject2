"use client";

import React, { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function AriaCard() {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotX: 0, rotY: 0, shine: { x: 50, y: 50 } });
  const [hovered, setHovered] = useState(false);
  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const rect = cardRef.current!.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);

      // shine position (percentage)
      const shineX = ((e.clientX - rect.left) / rect.width) * 100;
      const shineY = ((e.clientY - rect.top) / rect.height) * 100;

      setTransform({
        rotX: -dy * 12,   // tilt up/down max 12°
        rotY: dx * 12,    // tilt left/right max 12°
        shine: { x: shineX, y: shineY },
      });
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setTransform({ rotX: 0, rotY: 0, shine: { x: 50, y: 50 } });
  }, []);

  return (
    <div style={{ perspective: "900px", perspectiveOrigin: "center" }}>
      <div
        ref={cardRef}
        className="w-[295px] flex flex-col font-sans overflow-hidden relative"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          background: "rgba(8, 8, 8, 0.9)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: hovered
            ? "1px solid rgba(255,255,255,0.18)"
            : "1px solid rgba(255,255,255,0.09)",
          borderRadius: "18px",
          boxShadow: hovered
            ? `0 30px 70px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06) inset`
            : "0 8px 48px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.05) inset",
          transform: hovered
            ? `rotateX(${transform.rotX}deg) rotateY(${transform.rotY}deg) scale(1.02)`
            : "rotateX(0deg) rotateY(0deg) scale(1)",
          transformStyle: "preserve-3d",
          transition: hovered
            ? "transform 0.08s linear, box-shadow 0.3s ease, border-color 0.3s ease"
            : "transform 0.5s cubic-bezier(0.34,1.2,0.64,1), box-shadow 0.4s ease, border-color 0.3s ease",
          willChange: "transform",
          cursor: "default",
        }}
      >
        {/* Shine overlay */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[18px] z-10"
          style={{
            background: hovered
              ? `radial-gradient(circle at ${transform.shine.x}% ${transform.shine.y}%, rgba(255,255,255,0.10) 0%, transparent 65%)`
              : "none",
            transition: "opacity 0.2s ease",
          }}
        />

        {/* ── Header ── */}
        <div
          className="flex items-center justify-end px-4 py-3"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", paddingRight: "16px" }}
        >
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
            }}
          >
            
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className="animate-pulse"
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#4ade80",
                boxShadow: "0 0 6px #4ade80",
              }}
            />
            <span
              style={{
                fontSize: 9,
                fontWeight: 600,
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              Online
            </span>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-col px-4 pt-4 pb-4 gap-3">

          {/* ARIA Intro */}
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 42,
                height: 42,
                flexShrink: 0,
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
                border: "1px solid rgba(255,255,255,0.14)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 800, color: "#fff", letterSpacing: "0.5px" }}>
                AR
              </span>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px", lineHeight: 1.2 }}>
                Hi, I'm ARIA
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
                Your AI Viva Examiner · v2.0
              </div>
            </div>
          </div>

          {/* Stat Grid */}
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { value: "4,102", label: "Knowledge Nodes" },
              { value: "98%",   label: "Confidence" },
              { value: "12ms",  label: "Response Time" },
              { value: "v2.0",  label: "Model Version" },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 10,
                  padding: "8px 6px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px", lineHeight: 1 }}>
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: 8,
                    color: "rgba(255,255,255,0.3)",
                    marginTop: 3,
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    lineHeight: 1.3,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Status Row */}
          <div
            className="flex items-center justify-between"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10,
              padding: "8px 12px",
            }}
          >
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>
              Awaiting your question…
            </span>
            <div className="flex gap-1 items-center">
              {[0, 0.18, 0.36].map((d, i) => (
                <span
                  key={i}
                  className="animate-bounce"
                  style={{
                    display: "inline-block",
                    width: 3,
                    height: 3,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.35)",
                    animationDelay: `${d}s`,
                    animationDuration: "1s",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.07)" }} />

          {/* Progress Bars */}
          <div className="flex flex-col gap-2">
            {[
              { label: "Session Readiness", pct: 100 },
              { label: "Topics Mapped",     pct: 87  },
              { label: "Voice Synthesis",   pct: 100 },
            ].map((p, i) => (
              <div key={i}>
                <div className="flex justify-between" style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: 8, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                    {p.label}
                  </span>
                  <span style={{ fontSize: 8, color: "rgba(255,255,255,0.22)", fontVariantNumeric: "tabular-nums" }}>
                    {p.pct === 100 ? "Ready" : `${p.pct}%`}
                  </span>
                </div>
                <div style={{ height: 2, background: "rgba(255,255,255,0.08)", borderRadius: 999, overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${p.pct}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, rgba(255,255,255,0.5), rgba(255,255,255,0.2))",
                      borderRadius: 999,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.07)" }} />

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => window.location.href = "/upload"}
              style={{
                width: "100%",
                padding: "9px 0",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.4px",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseOver={e => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
              onMouseOut={e  => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            >
              Start Viva Session
            </button>
            <button
              onClick={() => window.location.href = "/upload"}
              style={{
                width: "100%",
                padding: "9px 0",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "transparent",
                color: "rgba(255,255,255,0.4)",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.4px",
                cursor: "pointer",
                transition: "color 0.2s, border-color 0.2s",
              }}
              onMouseOver={e => { e.currentTarget.style.color = "rgba(255,255,255,0.75)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; }}
              onMouseOut={e  => { e.currentTarget.style.color = "rgba(255,255,255,0.4)";  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
            >
              Upload Manual
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
