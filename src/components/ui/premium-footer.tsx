"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ShineBorder } from "@/components/ui/shine-border";

function PricingSection() {
  const [isAnnual, setIsAnnual] = React.useState(false);

  const prices = { starter: 0, pro: 49, enterprise: 199 };
  const getPrice = (base: number) =>
    base === 0 ? 0 : Math.round(base * (isAnnual ? 0.8 : 1));

  const CheckIcon = () => (
    <svg viewBox="0 0 16 16">
      <polyline points="2 8 6 12 14 4" />
    </svg>
  );

  const plans = [
    {
      id: "starter",
      name: "Starter",
      base: 0,
      tagline: "For curious minds exploring the edge.",
      featured: false,
      badge: null,
      btnLabel: "Get started free",
      btnClass: "plan-btn-outline",
      features: ["50 queries / day", "Basic semantic mapping", "PDF & Word support", "Community access"],
    },
    {
      id: "pro",
      name: "Pro",
      base: 49,
      tagline: "For researchers and academics who demand precision.",
      featured: true,
      badge: "Most Popular",
      btnLabel: "Start Pro trial",
      btnClass: "plan-btn-filled",
      features: [
        "Unlimited queries",
        "Full semantic graph (4,100+ nodes)",
        "Voice synthesis & session",
        "GitHub integration",
        "Priority support",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      base: 199,
      tagline: "For institutions requiring full deployment.",
      featured: false,
      badge: null,
      btnLabel: "Contact sales",
      btnClass: "plan-btn-outline",
      features: [
        "Everything in Pro",
        "On-premise deployment",
        "Custom model fine-tuning",
        "SLA guarantee & SSO",
        "Dedicated engineer",
      ],
    },
  ];

  return (
    <section className="pricing-section">
      <div className="pricing-header">
        <div className="pricing-section-label">Pricing</div>
        <h2 className="pricing-section-title">
          Invest in<br /><span>your intelligence.</span>
        </h2>
        <div className="pricing-toggle">
          <span className={`toggle-label ${!isAnnual ? "active" : ""}`}>Monthly</span>
          <div
            className={`toggle-switch ${isAnnual ? "annual" : ""}`}
            onClick={() => setIsAnnual(!isAnnual)}
          >
            <div className="toggle-knob" />
          </div>
          <span className={`toggle-label ${isAnnual ? "active" : ""}`}>
            Annual{" "}
            {isAnnual && <span className="badge-save">Save 20%</span>}
          </span>
        </div>
      </div>

      <div className="pricing-grid">
        {plans.map((plan) => (
          <div key={plan.id} className={`plan-card ${plan.featured ? "featured" : ""}`}>
            {plan.badge
              ? <div className="plan-badge">{plan.badge}</div>
              : <div className="plan-badge-ghost" />
            }
            <div className="plan-name">{plan.name}</div>
            <div className="plan-price-wrap">
              <span className="plan-currency">$</span>
              <span className="plan-price">{getPrice(plan.base)}</span>
              <span className="plan-period">/mo</span>
            </div>
            <p className="plan-tagline">{plan.tagline}</p>
            <div className="plan-divider" />
            <ul className="plan-features">
              {plan.features.map((f) => (
                <li key={f}>
                  <span className="plan-check">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2}>
                      <polyline points="2 8 6 12 14 4" />
                    </svg>
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <button className={`plan-btn ${plan.btnClass}`}>{plan.btnLabel}</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function PremiumFooter() {
  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("footer-visible");
        });
      },
      { threshold: 0.1 }
    );
    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addRef = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  const features = [
    {
      tag: "Core AI",
      title: "Neural Processing",
      desc: "Real-time semantic mapping across 4,100+ relational nodes with 98.4% confidence scoring.",
      icon: (
        <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, stroke: "currentColor", fill: "none", strokeWidth: 1.5 }}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ),
    },
    {
      tag: "Analysis",
      title: "Semantic Mapping",
      desc: "Cross-references university-specific patterns and maps relational dependencies in milliseconds.",
      icon: (
        <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, stroke: "currentColor", fill: "none", strokeWidth: 1.5 }}>
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
    },
    {
      tag: "Voice",
      title: "Voice Synthesis",
      desc: "Vocal synthesizer tuned to examiner frequency. Active session listening with <12ms latency.",
      icon: (
        <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, stroke: "currentColor", fill: "none", strokeWidth: 1.5 }}>
          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
    },
    {
      tag: "Security",
      title: "Secure Sync",
      desc: "End-to-end encrypted DB sync. Your knowledge graph never leaves your environment.",
      icon: (
        <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, stroke: "currentColor", fill: "none", strokeWidth: 1.5 }}>
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      ),
    },
    {
      tag: "Monitor",
      title: "Live Monitoring",
      desc: "Stable 12ms latency tracking with real-time CORE_INIT diagnostics and session health.",
      icon: (
        <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, stroke: "currentColor", fill: "none", strokeWidth: 1.5 }}>
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
    {
      tag: "Connect",
      title: "Integrations",
      desc: "Native connectors for Google Drive, Word, PDF, and GitHub. Your workflow, unified.",
      icon: (
        <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, stroke: "currentColor", fill: "none", strokeWidth: 1.5 }}>
          <circle cx="18" cy="18" r="3" />
          <circle cx="6" cy="6" r="3" />
          <path d="M13 6h3a2 2 0 012 2v7M11 18H8a2 2 0 01-2-2V9" />
        </svg>
      ),
    },
  ];

  const marqueeItems = [
    "Neural Interface", "Semantic Mapping", "Voice Synthesis",
    "98.4% Confidence", "12ms Latency", "Secure Sync", "Live Monitoring", "Multi-Format",
    "Neural Interface", "Semantic Mapping", "Voice Synthesis",
    "98.4% Confidence", "12ms Latency", "Secure Sync", "Live Monitoring", "Multi-Format",
  ];

  const platformLinks = ["Home", "Upload Manual", "Dashboard", "Analytics"];
  const legalLinks = ["Privacy Policy", "Terms of Service", "Cookie Policy"];
  const socials = [
    {
      name: "Twitter",
      icon: (
        <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, stroke: "currentColor", fill: "none", strokeWidth: 1.5 }}>
          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
        </svg>
      ),
    },
    {
      name: "GitHub",
      icon: (
        <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, stroke: "currentColor", fill: "none", strokeWidth: 1.5 }}>
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
        </svg>
      ),
    },
    {
      name: "Discord",
      icon: (
        <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, stroke: "currentColor", fill: "none", strokeWidth: 1.5 }}>
          <circle cx="18" cy="18" r="3" />
          <circle cx="6" cy="6" r="3" />
          <path d="M13 6h3a2 2 0 012 2v7M11 18H8a2 2 0 01-2-2V9" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <style>{`
        .footer-reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .footer-reveal.footer-visible {
          opacity: 1;
          transform: none;
        }
        .footer-reveal-d1 { transition-delay: 0.1s; }
        .footer-reveal-d2 { transition-delay: 0.2s; }
        .footer-reveal-d3 { transition-delay: 0.3s; }

        .feature-card-wrap {
          background: #000;
          padding: 2.5rem 2rem;
          position: relative;
          overflow: hidden;
          cursor: default;
          transition: background 0.35s, transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .feature-card-wrap::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #333, transparent);
          transform: scaleX(0);
          transition: transform 0.4s ease;
        }
        .feature-card-wrap:hover { background: #0a0a0a; transform: translateY(-3px); }
        .feature-card-wrap:hover::before { transform: scaleX(1); }

        .feature-icon-wrap {
          width: 44px; height: 44px;
          border: 1px solid #222;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.5rem;
          color: #888;
          transition: border-color 0.3s, color 0.3s;
        }
        .feature-card-wrap:hover .feature-icon-wrap { border-color: #444; color: #fff; }

        .feature-tag-badge {
          display: inline-block;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #333;
          border: 1px solid #222;
          border-radius: 4px;
          padding: 3px 8px;
          margin-top: 1rem;
          transition: color 0.3s, border-color 0.3s;
          font-family: 'Inter', sans-serif;
        }
        .feature-card-wrap:hover .feature-tag-badge { color: #888; border-color: #444; }

        .marquee-track-anim {
          display: flex;
          gap: 3rem;
          animation: footer-marquee 20s linear infinite;
          white-space: nowrap;
          width: max-content;
        }
        @keyframes footer-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .footer-social-btn {
          width: 34px; height: 34px;
          border: 1px solid #1a1a1a;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          color: #555;
          text-decoration: none;
        }
        .footer-social-btn:hover { border-color: #444; background: #0a0a0a; color: #fff; }

        .footer-col-link {
          font-size: 13px;
          color: #444;
          text-decoration: none;
          transition: color 0.2s;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
        }
        .footer-col-link:hover { color: #fff; }

        .footer-bottom-link {
          font-size: 12px;
          color: #2a2a2a;
          text-decoration: none;
          transition: color 0.2s;
          cursor: pointer;
        }
        .footer-bottom-link:hover { color: #555; }

        .cta-upload-btn {
          position: relative;
          display: inline-flex;
          overflow: hidden;
          border-radius: 12px;
        }
        .cta-upload-inner {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.85rem 2rem;
          background: rgba(255,255,255,0.05);
          border-radius: 11px;
          color: #fff;
          font-size: 15px;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          text-decoration: none;
          transition: background 0.3s;
          gap: 0.5rem;
        }
        .cta-upload-inner:hover { background: rgba(255,255,255,0.1); }
        .cta-upload-inner:hover .cta-arrow { transform: translateX(4px); }
        .cta-arrow { transition: transform 0.3s; }

/* ─── PRICING ─── */
.pricing-section {
  background: #000;
  padding: 7rem 3rem;
  font-family: 'Inter', sans-serif;
  position: relative;
}
.pricing-header {
  text-align: center;
  margin-bottom: 5rem;
}
.pricing-section-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #555;
  margin-bottom: 1rem;
}
.pricing-section-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -2px;
  color: #fff;
}
.pricing-section-title span { color: #555; }

.pricing-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}
.toggle-label { font-size: 13px; color: #555; transition: color 0.2s; }
.toggle-label.active { color: #fff; }

.toggle-switch {
  width: 44px; height: 24px;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 999px;
  position: relative;
  cursor: pointer;
  transition: background 0.2s;
}
.toggle-knob {
  width: 18px; height: 18px;
  background: #fff;
  border-radius: 50%;
  position: absolute;
  top: 2px; left: 2px;
  transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
}
.toggle-switch.annual .toggle-knob { transform: translateX(20px); }

.badge-save {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  background: #fff;
  color: #000;
  padding: 3px 8px;
  border-radius: 4px;
  margin-left: 0.3rem;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5px;
  background: #1a1a1a;
  border: 1.5px solid #1a1a1a;
  border-radius: 20px;
  overflow: hidden;
  max-width: 1000px;
  margin: 0 auto;
  perspective: 1000px;
}

.plan-card {
  background: #000;
  padding: 2.5rem 2rem;
  position: relative;
  overflow: hidden;
  transition: background 0.35s, transform 0.4s cubic-bezier(0.34,1.4,0.64,1);
  transform-origin: center bottom;
  transform-style: preserve-3d;
}
.plan-card.featured { background: #060606; }
.plan-card:hover { background: #0d0d0d; transform: translateY(-6px) scale(1.01); z-index: 2; }
.plan-card.featured:hover { background: #111; }

.plan-badge {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #000;
  background: #fff;
  padding: 4px 10px;
  border-radius: 4px;
  margin-bottom: 1.5rem;
}
.plan-badge-ghost { display: inline-block; height: 26px; margin-bottom: 1.5rem; }

.plan-name {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #555;
  margin-bottom: 0.5rem;
}

.plan-price-wrap { display: flex; align-items: baseline; gap: 4px; margin: 1.2rem 0 0.4rem; }
.plan-currency { font-size: 18px; font-weight: 600; color: #666; }
.plan-price { font-size: 56px; font-weight: 800; letter-spacing: -4px; color: #fff; line-height: 1; transition: all 0.3s; }
.plan-period { font-size: 13px; color: #444; align-self: flex-end; margin-bottom: 6px; }

.plan-tagline { font-size: 13px; color: #444; margin-bottom: 2rem; line-height: 1.5; }
.plan-divider { width: 100%; height: 1px; background: #111; margin-bottom: 1.5rem; }

.plan-features { list-style: none; margin-bottom: 2rem; padding: 0; }
.plan-features li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  color: #555;
  padding: 5px 0;
  transition: color 0.2s;
}
.plan-card:hover .plan-features li { color: #888; }
.plan-check { width: 16px; height: 16px; flex-shrink: 0; margin-top: 1px; }
.plan-check svg { width: 16px; height: 16px; stroke: #333; fill: none; stroke-width: 2; }
.plan-card.featured .plan-check svg { stroke: #888; }

.plan-btn {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.5px;
  transition: all 0.2s;
  font-family: 'Inter', sans-serif;
}
.plan-btn-outline { background: transparent; border: 1px solid #222; color: #555; }
.plan-btn-outline:hover { border-color: #555; color: #fff; }
.plan-btn-filled { background: #fff; border: 1px solid #fff; color: #000; }
.plan-btn-filled:hover { background: #e0e0e0; }
      `}
      </style>

      {/* ─── FEATURES SECTION ─── */}
      <section
        style={{
          background: "#000",
          padding: "7rem 3rem",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Section Header */}
        <div
          ref={addRef}
          className="footer-reveal"
          style={{ textAlign: "center", marginBottom: "5rem" }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#555",
              marginBottom: "1rem",
            }}
          >
            Capabilities
          </div>
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-2px",
              color: "#fff",
            }}
          >
            Ready to face the{" "}
            <span style={{ color: "#555" }}>AI Examiner?</span>
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "#666",
              marginTop: "1rem",
              maxWidth: 500,
              lineHeight: 1.7,
              margin: "1rem auto 0",
            }}
          >
            Upload your manual. Let the neural network build your personalized viva session. Prepare smarter, not harder.
          </p>
        </div>

        {/* Features Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.5px",
            background: "#1a1a1a",
            border: "1.5px solid #1a1a1a",
            borderRadius: 16,
            overflow: "hidden",
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          {features.map((f, i) => (
            <div
              key={f.title}
              ref={addRef}
              className={`feature-card-wrap footer-reveal footer-reveal-d${(i % 3) + 1}`}
            >
              <div className="feature-icon-wrap">{f.icon}</div>
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#fff",
                  marginBottom: "0.6rem",
                  letterSpacing: "-0.3px",
                }}
              >
                {f.title}
              </h3>
              <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }}>
                {f.desc}
              </p>
              <span className="feature-tag-badge">{f.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <PricingSection />

      {/* ─── MARQUEE ─── */}
      <div
        style={{
          borderTop: "1px solid #111",
          borderBottom: "1px solid #111",
          padding: "1.2rem 0",
          overflow: "hidden",
          background: "#000",
        }}
      >
        <div className="marquee-track-anim">
          {marqueeItems.map((item, i) => (
            <span
              key={i}
              style={{
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#333",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "#444",
                }}
              />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ─── FOOTER ─── */}
      <footer
        style={{
          background: "#000",
          borderTop: "1px solid #111",
          padding: "5rem 3rem 3rem",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        
       

        {/* Footer Top Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr",
            gap: "3rem",
            marginBottom: "4rem",
          }}
        >
          {/* Brand */}
          <div ref={addRef} className="footer-reveal">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: "1.5px solid #333",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 12,
                  color: "#fff",
                }}
              >
                V
              </div>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  letterSpacing: "-0.5px",
                  color: "#fff",
                }}
              >
                Viva<span style={{ color: "#fff" }}>Coach</span>
              </span>
            </div>
            <p
              style={{
                fontSize: 13,
                color: "#444",
                lineHeight: 1.7,
                marginBottom: "1.5rem",
                maxWidth: 260,
              }}
            >
              Transforming traditional education into interactive, neural-driven experiences.
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {socials.map((s) => (
                <a key={s.name} href="#" className="footer-social-btn" title={s.name}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div ref={addRef} className="footer-reveal footer-reveal-d1">
            <h4
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#333",
                marginBottom: "1.25rem",
              }}
            >
              Platform
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {platformLinks.map((link) => (
                <li key={link} style={{ marginBottom: "0.65rem" }}>
                  <Link href="#" className="footer-col-link">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div ref={addRef} className="footer-reveal footer-reveal-d2">
            <h4
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#333",
                marginBottom: "1.25rem",
              }}
            >
              Legal
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {legalLinks.map((link) => (
                <li key={link} style={{ marginBottom: "0.65rem" }}>
                  <Link href="#" className="footer-col-link">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid #0f0f0f",
            paddingTop: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 12, color: "#2a2a2a" }}>
            © {new Date().getFullYear()} AI Viva Coach. All rights reserved.
          </span>
          <div style={{ display: "flex", gap: "2rem" }}>
            {["Privacy", "Terms", "Status"].map((item) => (
              <a key={item} href="#" className="footer-bottom-link">
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}