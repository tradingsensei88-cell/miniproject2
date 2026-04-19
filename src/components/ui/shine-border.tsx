"use client";

import { cn } from "@/lib/utils";

interface ShineBorderProps {
  borderRadius?: number;
  borderWidth?: number;
  duration?: number;
  color?: string | string[];
  className?: string;
}

/**
 * @name Shine Border
 * @description It is an animated background border effect that adds a shiny moving border around a container.
 */
export function ShineBorder({
  borderRadius = 32,
  borderWidth = 1,
  duration = 14,
  color = "#A07CFE",
  className,
}: ShineBorderProps) {
  return (
    <div
      style={
        {
          "--border-radius": `${borderRadius}px`,
          "--duration": `${duration}s`,
          "--border-width": `${borderWidth}px`,
          "--background-radial-gradient": `radial-gradient(transparent,transparent, ${
            Array.isArray(color) ? color.join(",") : color
          },transparent,transparent)`,
        } as React.CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 size-full rounded-[var(--border-radius)]",
        "before:absolute before:inset-[-100%] before:bg-[conic-gradient(from_0deg,transparent_0_340deg,var(--background-radial-gradient)_360deg)] before:content-['']",
        "before:animate-shine-border-rotate",
        "after:absolute after:inset-[var(--border-width)] after:bg-transparent after:rounded-[calc(var(--border-radius)-var(--border-width))] after:content-['']",
        className
      )}
    ></div>
  );
}
