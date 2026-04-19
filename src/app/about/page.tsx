"use client";

import React, { useEffect } from "react";
import {
  Navbar,
  NavBody,
  NavItems,
  NavbarLogo,
  NavbarButton,
} from "@/components/ui/resizable-navbar";
import { useRouter } from "next/navigation";

const navItems = [
  { name: "Home", link: "/" },
  { name: "Upload", link: "/upload" },
  { name: "About", link: "/about" },
];

export default function AboutPage() {
  const router = useRouter();

  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    const onPopState = () => {
      window.location.href = '/';
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [router]);

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-hidden">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      {/* ─── Navbar ─── */}
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <NavbarButton href="/" variant="primary">
            Get Started
          </NavbarButton>
        </NavBody>
      </Navbar>

      {/* ─── Main Content ─── */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <div className="text-center w-full max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            About AI Viva Coach
          </h1>
          <p className="text-neutral-400 text-base md:text-lg leading-relaxed">
            AI Viva Coach is a neural mapping examiner designed to process lab manuals 
            and curriculum documents into actionable intelligence.
          </p>
        </div>
      </main>
    </div>
  );
}
