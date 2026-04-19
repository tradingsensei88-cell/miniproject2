"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Application } from "@splinetool/runtime";

interface SplineSceneProps {
  scene: string;
  className?: string;
  onLoad?: (app: Application) => void;
  renderOnDemand?: boolean;
}

const SplineScene = ({
  scene,
  className = "",
  onLoad,
  renderOnDemand = true,
}: SplineSceneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initSpline = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;

    // Clean up previous instance
    if (appRef.current) {
      appRef.current.dispose();
      appRef.current = null;
    }
    
    // Clear out any stale canvases from rapid unmount/remount cycles
    container.innerHTML = "";

    // Manually create the canvas so React never tries to manage its DOM lifecycle
    // (Prevents "removeChild" crashes when Spline manipulates the nodes)
    const canvas = document.createElement("canvas");
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    container.appendChild(canvas);

    setIsLoading(true);

    try {
      const app = new Application(canvas, { renderOnDemand });
      appRef.current = app;

      await app.load(scene);

      // Make canvas background transparent so elements behind show through
      try {
        const renderer = (app as any)._renderer;
        if (renderer) {
          renderer.setClearAlpha(0);
          renderer.setClearColor(0x000000, 0);
        }
      } catch (e) {}

      setIsLoading(false);
      onLoad?.(app);
    } catch (err) {
      console.error("Spline initialization error:", err);
      setIsLoading(false);
    }
  }, [scene, renderOnDemand, onLoad]);

  useEffect(() => {
    initSpline();

    return () => {
      // Synchronous dispose is now safe because React isn't managing the canvas DOM
      if (appRef.current) {
        try {
          appRef.current.dispose();
        } catch (e) {}
        appRef.current = null;
      }
    };
  }, [initSpline]);

  // Handle resize via IntersectionObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && appRef.current) {
          appRef.current.requestRender();
          appRef.current.setSize(container.clientWidth, container.clientHeight);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Handle window resize
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const container = containerRef.current;
        if (container && appRef.current) {
          appRef.current.setSize(container.clientWidth, container.clientHeight);
        }
      }, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className={`spline-wrapper relative w-full h-full ${className}`}>
      <div 
        ref={containerRef} 
        className="absolute inset-0 w-full h-full pointer-events-auto"
      />
      {isLoading && (
        <div className="spline-loader absolute inset-0 flex items-center justify-center">
          <div className="spline-loader-spinner w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default SplineScene;
