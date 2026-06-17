"use client";

import { useReducedMotion } from "framer-motion";

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_SPRING = [0.34, 1.56, 0.64, 1] as const;
export const EASE_DRAMATIC = [0.19, 1, 0.22, 1] as const;

export function useMotionVariants() {
  const reduceMotion = useReducedMotion();
  const instant = reduceMotion ? 0 : undefined;

  return {
    page: {
      hidden: reduceMotion ? { opacity: 1 } : { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          duration: instant ?? 0.35,
          ease: EASE_OUT_EXPO,
          staggerChildren: reduceMotion ? 0 : 0.07,
        },
      },
    },
    section: {
      hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 28 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: instant ?? 0.72, ease: EASE_OUT_EXPO },
      },
    },
    headline: {
      hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 34 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: instant ?? 0.86, ease: EASE_DRAMATIC },
      },
    },
    card: {
      hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 22 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: instant ?? 0.62, ease: EASE_OUT_EXPO },
      },
      hover: {
        scale: reduceMotion ? 1 : 1.025,
        transition: { duration: instant ?? 0.24, ease: EASE_SPRING },
      },
      tap: {
        scale: reduceMotion ? 1 : 0.985,
        transition: { duration: instant ?? 0.2, ease: EASE_SPRING },
      },
    },
  };
}
