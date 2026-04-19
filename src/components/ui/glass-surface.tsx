"use client";

import React, { useRef, useState, useEffect, useMemo, useId } from 'react';

interface GlassSurfaceProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: number;
  borderWidth?: number;
  brightness?: number;
  opacity?: number;
  blur?: number;
  displace?: number;
  backgroundOpacity?: number;
  saturation?: number;
  distortionScale?: number;
  redOffset?: number;
  greenOffset?: number;
  blueOffset?: number;
  xChannel?: 'R' | 'G' | 'B' | 'A';
  yChannel?: 'R' | 'G' | 'B' | 'A';
  mixBlendMode?: React.CSSProperties['mixBlendMode'];
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function GlassSurface({
  width = '100%',
  height = '100%',
  borderRadius = 20,
  borderWidth = 0.07,
  brightness = 70,
  opacity = 0.8,
  blur = 11,
  displace = 0.5,
  backgroundOpacity = 0.05,
  saturation = 1.2,
  distortionScale = -180,
  redOffset = 0,
  greenOffset = 10,
  blueOffset = 20,
  xChannel = 'R',
  yChannel = 'G',
  mixBlendMode = 'difference',
  className = '',
  style = {},
  children,
}: GlassSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const feImageRef = useRef<SVGFEImageElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to true based on the site theme
  const uniqueId = useId().replace(/:/g, '');
  const filterId = `glass-filter-${uniqueId}`;
  const redGradId = `red-grad-${uniqueId}`;
  const blueGradId = `blue-grad-${uniqueId}`;

  const [mapHref, setMapHref] = useState("");

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const updateDisplacementMap = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const actualWidth = rect.width || 400;
    const actualHeight = rect.height || 200;
    const edgeSize = Math.min(actualWidth, actualHeight) * (borderWidth * 0.5);

    const svgContent = `
      <svg viewBox="0 0 ${actualWidth} ${actualHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="blue"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" fill="black"></rect>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${borderRadius}" fill="url(#${redGradId})" />
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${borderRadius}" fill="url(#${blueGradId})" style="mix-blend-mode: ${mixBlendMode}" />
        <rect x="${edgeSize}" y="${edgeSize}" width="${actualWidth - edgeSize * 2}" height="${actualHeight - edgeSize * 2}" rx="${borderRadius}" fill="hsl(0 0% ${brightness}% / ${opacity})" style="filter:blur(${blur}px)" />
      </svg>
    `;
    setMapHref(`data:image/svg+xml,${encodeURIComponent(svgContent)}`);
  };

  useEffect(() => {
    let resizeObserver: ResizeObserver | null = null;
    if (containerRef.current && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updateDisplacementMap();
      });
      resizeObserver.observe(containerRef.current);
    }
    updateDisplacementMap();
    return () => {
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [width, height, borderRadius, borderWidth, brightness, opacity, blur, mixBlendMode]);

  const fallbackStyles = useMemo(() => {
    return {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(16px) saturate(1.8)',
      WebkitBackdropFilter: 'blur(16px) saturate(1.8)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
    };
  }, []);

  const containerStyles: React.CSSProperties = {
    ...style,
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius: `${borderRadius}px`,
    ...((mapHref ? { backdropFilter: `url(#${filterId}) saturate(${saturation})` } : fallbackStyles) as any),
    ...(mapHref && {
      background: `hsl(0 0% ${isDarkMode ? 0 : 100}% / ${backgroundOpacity})`,
      boxShadow: isDarkMode
        ? `0 0 2px 1px color-mix(in oklch, white, transparent 65%) inset,
           0 0 10px 4px color-mix(in oklch, white, transparent 85%) inset,
           0px 4px 16px rgba(17, 17, 26, 0.05)`
        : `0 0 2px 1px color-mix(in oklch, black, transparent 85%) inset,
           0 0 10px 4px color-mix(in oklch, black, transparent 90%) inset,
           0px 4px 16px rgba(17, 17, 26, 0.05)`
    })
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center overflow-hidden transition-opacity duration-[260ms] ease-out ${className}`}
      style={containerStyles}
    >
      <svg className="w-full h-full pointer-events-none absolute inset-0 opacity-0 -z-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%">
            {mapHref && <feImage ref={feImageRef} href={mapHref} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />}

            <feDisplacementMap in="SourceGraphic" in2="map" id="redchannel" result="dispRed" scale={distortionScale + redOffset} xChannelSelector={xChannel} yChannelSelector={yChannel} />
            <feColorMatrix in="dispRed" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="red" />

            <feDisplacementMap in="SourceGraphic" in2="map" id="greenchannel" result="dispGreen" scale={distortionScale + greenOffset} xChannelSelector={xChannel} yChannelSelector={yChannel} />
            <feColorMatrix in="dispGreen" type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="green" />

            <feDisplacementMap in="SourceGraphic" in2="map" id="bluechannel" result="dispBlue" scale={distortionScale + blueOffset} xChannelSelector={xChannel} yChannelSelector={yChannel} />
            <feColorMatrix in="dispBlue" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="blue" />

            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue" mode="screen" result="output" />
            <feGaussianBlur in="output" stdDeviation={displace} />
          </filter>
        </defs>
      </svg>

      <div className="w-full h-full flex items-center justify-center p-2 rounded-[inherit] relative z-10">
        {children}
      </div>
    </div>
  );
}
