"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface ScrollSequenceProps {
  frameCount: number;
  pathPrefix: string;
}

function padIndex(n: number): string {
  return String(n).padStart(5, "0");
}

export default function ScrollSequence({
  frameCount = 192,
  pathPrefix = "/video/",
}: ScrollSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // 1. Preload Images
    let loadedCount = 0;
    const imgs: HTMLImageElement[] = [];

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const handleLoad = () => {
        loadedCount++;
        setProgress(Math.round((loadedCount / frameCount) * 100));
        if (loadedCount === frameCount) {
          setLoaded(true);
        }
      };
      img.onload = handleLoad;
      img.onerror = handleLoad;
      img.src = `${pathPrefix}${padIndex(i)}.jpg`;
      
      // Fallback in case the image is already completely loaded from cache
      if (img.complete && img.naturalWidth !== 0) {
        // Technically setting src might have been synchronous, let's ensure we don't double count
        img.onload = null;
        img.onerror = null;
        handleLoad();
      }
      imgs.push(img);
    }
    
    imagesRef.current = imgs;
  }, [frameCount, pathPrefix]);

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = imagesRef.current[index];
    if (!img || !img.complete || !img.naturalWidth) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    // Ensure canvas dimensions match physical pixels for crisp rendering
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // object-fit: contain logic
    const ir = img.naturalWidth / img.naturalHeight;
    const cr = w / h;
    let dw: number, dh: number, dx: number, dy: number;
    
    if (ir > cr) {
      // Image is wider than canvas ratio
      dw = w;
      dh = w / ir;
      dx = 0;
      dy = (h - dh) / 2;
    } else {
      // Image is taller than canvas ratio
      dh = h;
      dw = h * ir;
      dx = (w - dw) / 2;
      dy = 0;
    }
    
    ctx.drawImage(img, dx, dy, dw, dh);
  };

  useEffect(() => {
    if (!loaded) return;

    // Draw frame 0 immediately once loaded
    drawFrame(0);

    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // We use an object to animate a property from 0 to frameCount - 1
      const playhead = { frame: 0 };
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: `+=${frameCount * 40}`, // Doubled to allow forward and reverse
          pin: true,
          scrub: 1, // 1 second smoothing
          onUpdate: () => {
            drawFrame(Math.floor(playhead.frame));
          },
        },
      });

      // Forward animation
      tl.to(playhead, {
        frame: frameCount - 1,
        snap: "frame", // ensures frame is an integer
        ease: "none",
        duration: 1,
      })
      // Reverse animation
      .to(playhead, {
        frame: 0,
        snap: "frame",
        ease: "none",
        duration: 1,
      });

      if (textRef.current) {
        gsap.fromTo(
          textRef.current,
          { y: "80vh" },
          {
            y: "-450vh",
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "top top",
              end: `+=${frameCount * 40}`,
              scrub: 1,
            },
          }
        );
      }
    }, container);

    return () => {
      ctx.revert();
    };
  }, [loaded, frameCount]);

  return (
    <div ref={containerRef} className="w-full h-[100vh] bg-[#020202] relative flex items-start justify-start">
      <div 
        className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md text-white"
        style={{ 
          opacity: loaded ? 0 : 1, 
          pointerEvents: loaded ? "none" : "auto", 
          transition: "opacity 0.5s ease" 
        }}
      >
        <div className="w-48 h-1 bg-white/20 rounded overflow-hidden mb-4">
          <div 
            className="h-full bg-[#8a64ff] transition-all duration-200" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-sm font-mono text-white/50 uppercase tracking-widest">
          Loading Video Frames {progress}%
        </div>
      </div>
      <div 
        className="w-[100vw] md:w-[75vw] h-[100vh] relative overflow-hidden z-0"
        style={{ 
          WebkitMaskImage: 'linear-gradient(to right, black 70%, transparent 100%)', 
          maskImage: 'linear-gradient(to right, black 70%, transparent 100%)' 
        }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block touch-none"
          style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.5s ease" }}
        />
      </div>

      <div 
        ref={textRef} 
        className="absolute right-[4vw] top-0 w-[26vw] flex flex-col gap-[35vh] z-10 hidden md:block"
        style={{ pointerEvents: 'none' }}
      >
        <div className="flex flex-col gap-4">
          <h3 className="text-5xl font-light tracking-tight text-white">Autonomous Logic</h3>
          <p className="text-white/60 text-sm leading-relaxed font-mono uppercase tracking-widest">Bridging the vast, ever-widening gap between the unrelenting force of raw computational power and the nuanced, irreplaceable depth of human intuition — forging a seamless continuum where machines don't merely calculate, but comprehend.</p>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-5xl font-light tracking-tight text-white">Neural Mapping</h3>
          <p className="text-white/60 text-sm leading-relaxed font-mono uppercase tracking-widest">Real-time synapse generation engineered for the most volatile and demanding dynamic workloads — a living, breathing topology that rewires itself instantaneously as conditions shift, complexity compounds, and data surges without warning.</p>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-5xl font-light tracking-tight text-white">Infinite Scale</h3>
          <p className="text-white/60 text-sm leading-relaxed font-mono uppercase tracking-widest">An architecture conceived from its very foundation to effortlessly absorb, process, and respond to unbounded data streams of any magnitude — growing not as an afterthought, but as an intrinsic, inevitable expression of its own design.</p>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-5xl font-light tracking-tight text-white">Quantum Precision</h3>
          <p className="text-white/60 text-sm leading-relaxed font-mono uppercase tracking-widest">Every calculation meticulously optimized to operate within sub-millisecond tolerances, where the margin between accuracy and error collapses entirely — delivering outcomes so exact, so razor-sharp, that uncertainty itself becomes obsolete.</p>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-5xl font-light tracking-tight text-white">Adaptive Reasoning</h3>
          <p className="text-white/60 text-sm leading-relaxed font-mono uppercase tracking-widest">Self-correcting heuristics that don't merely function — they mature continuously, accumulating experience with every cycle, refining their own logic, and evolving beyond their original parameters to meet challenges that didn't yet exist when they were built.</p>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-5xl font-light tracking-tight text-white">Deep Synthesis</h3>
          <p className="text-white/60 text-sm leading-relaxed font-mono uppercase tracking-widest">The profound, generative act of fusing abstract, formless concepts — ideas that exist only as intention — into fully executable, structurally sound code architectures capable of operating in the real world at production scale.</p>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-5xl font-light tracking-tight text-white">Edge Execution</h3>
          <p className="text-white/60 text-sm leading-relaxed font-mono uppercase tracking-widest">Processing deliberately brought as physically and logically close to the source of data as the laws of infrastructure allow — eliminating latency at its root, collapsing the distance between stimulus and response into something approaching instantaneous.</p>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-5xl font-light tracking-tight text-white">Total Singularity</h3>
          <p className="text-white/60 text-sm leading-relaxed font-mono uppercase tracking-widest">The inevitable, awe-inspiring convergence of raw artificial intellect and frictionless operational fluidity — a state in which the boundary between thinking and doing, between intelligence and action, dissolves completely and permanently.</p>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-5xl font-light tracking-tight text-white">Data Crystallization</h3>
          <p className="text-white/60 text-sm leading-relaxed font-mono uppercase tracking-widest">The transformative process of condensing petabytes upon petabytes of unstructured, chaotic, context-free information into distilled, immaculate pure logic — stripping away the noise until only signal, clarity, and meaning remain.</p>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-5xl font-light tracking-tight text-white">Synaptic Velocity</h3>
          <p className="text-white/60 text-sm leading-relaxed font-mono uppercase tracking-widest">Communication speeds painstakingly engineered to match, mirror, and ultimately surpass the cognitive firing rate of the human brain itself — so that no thought, no query, no demand ever waits longer than the mind that conceived it.</p>
        </div>
      </div>
    </div>
  );
}
