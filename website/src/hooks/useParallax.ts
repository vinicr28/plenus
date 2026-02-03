"use client";

import { useRef } from "react";
import { useScroll, useTransform, useSpring, MotionValue } from "framer-motion";

interface UseParallaxOptions {
  offset?: [string, string];
  smooth?: boolean;
}

interface UseParallaxReturn {
  ref: React.RefObject<HTMLDivElement | null>;
  scrollYProgress: MotionValue<number>;
  y: MotionValue<number>;
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
}

export function useParallax(
  distance: number = 100,
  options: UseParallaxOptions = {}
): UseParallaxReturn {
  const ref = useRef<HTMLDivElement | null>(null);
  const { offset = ["start end", "end start"], smooth = true } = options;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as ["start end", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [-distance, distance]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const rawScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.95, 1, 1, 0.95]);

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

  const y = smooth ? useSpring(rawY, springConfig) : rawY;
  const opacity = smooth ? useSpring(rawOpacity, springConfig) : rawOpacity;
  const scale = smooth ? useSpring(rawScale, springConfig) : rawScale;

  return { ref, scrollYProgress, y, opacity, scale };
}

export function useHeroParallax() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  return { y, opacity };
}

export function useStaggeredParallax(
  baseDistance: number = 50,
  index: number = 0,
  totalItems: number = 3
) {
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const multiplier = 1 + (index / totalItems) * 0.5;
  const distance = baseDistance * multiplier;

  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return { ref, y: smoothY, scrollYProgress };
}

export function useHorizontalParallax(distance: number = 100) {
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const smoothX = useSpring(x, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return { ref, x: smoothX, scrollYProgress };
}

// Deep parallax hook for Firewatch-style multi-layer effects
export interface DeepParallaxLayer {
  y: MotionValue<number>;
  opacity: MotionValue<number>;
  blur: MotionValue<number>;
  scale: MotionValue<number>;
}

export interface UseDeepParallaxReturn {
  scrollY: MotionValue<number>;
  layers: {
    sky: DeepParallaxLayer;
    atmosphere: DeepParallaxLayer;
    mainImage: DeepParallaxLayer;
    foreground: DeepParallaxLayer;
    content: DeepParallaxLayer;
  };
}

export function useDeepParallax(): UseDeepParallaxReturn {
  const { scrollY } = useScroll();

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

  // Layer 1: Sky - Almost static (0.1x speed)
  const skyY = useTransform(scrollY, [0, 1000], [0, 100]);
  const skyOpacity = useTransform(scrollY, [0, 800], [1, 0.8]);
  const skyBlur = useTransform(scrollY, [0, 500], [0, 2]);
  const skyScale = useTransform(scrollY, [0, 1000], [1, 1.05]);

  // Layer 2: Atmosphere/Glow - Very slow (0.2x speed)
  const atmosphereY = useTransform(scrollY, [0, 1000], [0, 200]);
  const atmosphereOpacity = useTransform(scrollY, [0, 600], [0.15, 0.05]);
  const atmosphereBlur = useTransform(scrollY, [0, 500], [0, 1]);
  const atmosphereScale = useTransform(scrollY, [0, 1000], [1, 1.1]);

  // Layer 3: Main image - Medium speed (0.4x speed)
  const mainImageY = useTransform(scrollY, [0, 1000], [0, 400]);
  const mainImageOpacity = useTransform(scrollY, [0, 700], [1, 0.6]);
  const mainImageBlur = useTransform(scrollY, [0, 800], [0, 3]);
  const mainImageScale = useTransform(scrollY, [0, 1000], [1.1, 1.2]);

  // Layer 4: Foreground gradient - Faster (0.7x speed)
  const foregroundY = useTransform(scrollY, [0, 1000], [0, 700]);
  const foregroundOpacity = useTransform(scrollY, [0, 500], [1, 0.3]);
  const foregroundBlur = useTransform(scrollY, [0, 500], [0, 0]);
  const foregroundScale = useTransform(scrollY, [0, 1000], [1, 1]);

  // Layer 5: Content - Fastest (1.3x speed) - flies away on scroll
  // Note: No scale animation to keep text stable and readable
  const contentY = useTransform(scrollY, [0, 600], [0, 780]);
  const contentOpacity = useTransform(scrollY, [0, 300, 500], [1, 1, 0]);
  const contentBlur = useTransform(scrollY, [0, 300], [0, 0]);
  const contentScale = useTransform(scrollY, [0, 1000], [1, 1]); // Fixed scale - no animation

  // Apply springs for smooth animation on background layers
  const smoothSkyY = useSpring(skyY, springConfig);
  const smoothAtmosphereY = useSpring(atmosphereY, springConfig);
  const smoothMainImageY = useSpring(mainImageY, springConfig);
  const smoothForegroundY = useSpring(foregroundY, springConfig);
  const smoothContentY = useSpring(contentY, springConfig);
  // Content opacity uses raw transform (no spring) to avoid jittery "pulsing"
  const smoothContentOpacity = contentOpacity;

  return {
    scrollY,
    layers: {
      sky: {
        y: smoothSkyY,
        opacity: skyOpacity,
        blur: skyBlur,
        scale: skyScale,
      },
      atmosphere: {
        y: smoothAtmosphereY,
        opacity: atmosphereOpacity,
        blur: atmosphereBlur,
        scale: atmosphereScale,
      },
      mainImage: {
        y: smoothMainImageY,
        opacity: mainImageOpacity,
        blur: mainImageBlur,
        scale: mainImageScale,
      },
      foreground: {
        y: smoothForegroundY,
        opacity: foregroundOpacity,
        blur: foregroundBlur,
        scale: foregroundScale,
      },
      content: {
        y: smoothContentY,
        opacity: smoothContentOpacity,
        blur: contentBlur,
        scale: contentScale, // Fixed at 1, no animation
      },
    },
  };
}

export function useScaleOnScroll() {
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.5, 1]);

  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return { ref, scale: smoothScale, opacity: smoothOpacity, scrollYProgress };
}
