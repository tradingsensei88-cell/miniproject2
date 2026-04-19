"use client";
import React, {
  useState,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";

// ─── Context ────────────────────────────────────────────────────────
interface NavbarContextType {
  scrolled: boolean;
}
const NavbarContext = createContext<NavbarContextType>({ scrolled: false });

// ─── Navbar (root) ──────────────────────────────────────────────────
export function Navbar({ children }: { children: ReactNode }) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  return (
    <NavbarContext.Provider value={{ scrolled }}>
      <nav className="fixed top-5 inset-x-0 z-[100] w-full pointer-events-none flex justify-center">
        <div className="w-full max-w-[900px] px-4 flex justify-center">
          {children}
        </div>
      </nav>
    </NavbarContext.Provider>
  );
}

// ─── NavBody (desktop bar) ──────────────────────────────────────────
export function NavBody({ children }: { children: ReactNode }) {
  // scrolling context is no longer needed to animate the width
  return (
    <div
      className="hidden md:flex items-center justify-between mx-auto pointer-events-auto w-full backdrop-blur-md"
      style={{
        padding: "6px 6px 6px 6px",
        background: "rgba(17, 17, 17, 0.45)",
        borderRadius: "100px",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
      }}
    >
      {children}
    </div>
  );
}

// ─── NavItems ───────────────────────────────────────────────────────
interface NavItem {
  name: string;
  link: string;
}

export function NavItems({ items }: { items: NavItem[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="flex items-center" style={{ gap: "8px" }}>
      {items.map((item, idx) => (
        <a
          key={idx}
          href={item.link}
          onMouseEnter={() => setHovered(idx)}
          onMouseLeave={() => setHovered(null)}
          className="relative"
          style={{
            padding: "8px 20px",
            fontSize: "0.9rem",
            fontWeight: 500,
            color:
              hovered === idx
                ? "rgba(255,255,255,1)"
                : "rgba(255,255,255,0.6)",
            textDecoration: "none",
            transition: "color 0.2s ease",
            letterSpacing: "0.01em",
          }}
        >
          {hovered === idx && (
            <motion.span
              layoutId={null} // Removed layoutId due to cross-page App Router unmount crashes
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0"
              style={{
                background: "rgba(255,255,255,0.08)",
                borderRadius: "100px",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{item.name}</span>
        </a>
      ))}
    </div>
  );
}

// ─── NavbarLogo ─────────────────────────────────────────────────────
export function NavbarLogo() {
  return (
    <a
      href="/"
      className="flex items-center justify-center shrink-0 no-underline"
      style={{
        width: "42px",
        height: "42px",
        borderRadius: "50%",
        overflow: "hidden",
      }}
    >
      <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
    </a>
  );
}

// ─── NavbarButton ───────────────────────────────────────────────────
interface NavbarButtonProps {
  variant?: "primary" | "secondary";
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
}

export function NavbarButton({
  variant = "primary",
  children,
  onClick,
  href,
  className = "",
}: NavbarButtonProps) {
  const isPrimary = variant === "primary";

  const styles = isPrimary
    ? {
        padding: "10px 24px",
        borderRadius: "100px",
        background: "#ffffff",
        color: "#111111",
        fontSize: "0.88rem",
        fontWeight: 600,
        border: "none",
        letterSpacing: "0.01em",
        textDecoration: "none",
        display: "inline-block",
      }
    : {
        padding: "10px 24px",
        borderRadius: "100px",
        background: "rgba(255,255,255,0.08)",
        color: "rgba(255,255,255,0.8)",
        fontSize: "0.88rem",
        fontWeight: 500,
        border: "1px solid rgba(255,255,255,0.1)",
        textDecoration: "none",
        display: "inline-block",
      };

  if (href) {
    return (
      <a
        href={href}
        className={`cursor-pointer transition-all duration-200 ${className}`}
        style={styles}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`cursor-pointer transition-all duration-200 ${className}`}
      style={styles}
    >
      {children}
    </button>
  );
}

// ─── MobileNav (wrapper) ────────────────────────────────────────────
export function MobileNav({ children }: { children: ReactNode }) {
  return <div className="md:hidden pointer-events-auto">{children}</div>;
}

// ─── MobileNavHeader ────────────────────────────────────────────────
export function MobileNavHeader({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex items-center justify-between backdrop-blur-md"
      style={{
        padding: "6px 6px 6px 6px",
        background: "rgba(17, 17, 17, 0.45)",
        borderRadius: "100px",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      {children}
    </div>
  );
}

// ─── MobileNavToggle ────────────────────────────────────────────────
interface MobileNavToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

export function MobileNavToggle({ isOpen, onClick }: MobileNavToggleProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center cursor-pointer"
      style={{
        width: "42px",
        height: "42px",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.08)",
        border: "none",
        gap: "5px",
      }}
      aria-label="Toggle menu"
    >
      <motion.span
        animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
        className="block"
        style={{ width: "18px", height: "2px", borderRadius: "2px", background: "rgba(255,255,255,0.8)" }}
      />
      <motion.span
        animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
        className="block"
        style={{ width: "18px", height: "2px", borderRadius: "2px", background: "rgba(255,255,255,0.8)" }}
      />
      <motion.span
        animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
        className="block"
        style={{ width: "18px", height: "2px", borderRadius: "2px", background: "rgba(255,255,255,0.8)" }}
      />
    </button>
  );
}

// ─── MobileNavMenu ──────────────────────────────────────────────────
interface MobileNavMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function MobileNavMenu({ isOpen, onClose, children }: MobileNavMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-2 flex flex-col gap-3 p-5 backdrop-blur-md"
          style={{
            background: "rgba(17, 17, 17, 0.45)",
            borderRadius: "24px",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 16px 64px rgba(0,0,0,0.5)",
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
