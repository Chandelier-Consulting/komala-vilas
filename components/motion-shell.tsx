"use client";

import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type HTMLMotionProps,
} from "framer-motion";
import { useRef } from "react";
import { useMotionVariants } from "@/lib/variants";

const REVEAL_VIEWPORT = {
  once: false,
  amount: 0.4,
  margin: "0px 0px -10% 0px",
} as const;

export function MotionMain({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <main className={className}>{children}</main>;
}

export function MotionSection({
  children,
  className,
  id,
  labelledBy,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  labelledBy?: string;
} & Omit<HTMLMotionProps<"section">, "children" | "className" | "id">) {
  const variants = useMotionVariants();

  return (
    <motion.section
      {...props}
      id={id}
      className={className}
      aria-labelledby={labelledBy}
      variants={variants.section}
      initial="hidden"
      whileInView="visible"
      viewport={REVEAL_VIEWPORT}
    >
      {children}
    </motion.section>
  );
}

export function MotionPresence({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {children}
    </AnimatePresence>
  );
}

export function MotionGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const variants = useMotionVariants();

  return (
    <motion.div
      className={className}
      variants={variants.group}
      initial="hidden"
      whileInView="visible"
      viewport={REVEAL_VIEWPORT}
    >
      {children}
    </motion.div>
  );
}

export function MotionLayoutGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const variants = useMotionVariants();

  return (
    <motion.div className={className} variants={variants.group} layout initial={false}>
      {children}
    </motion.div>
  );
}

export function MotionLayoutItem({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & Omit<HTMLMotionProps<"div">, "children" | "className">) {
  const variants = useMotionVariants();

  return (
    <motion.div
      {...props}
      className={className}
      variants={variants.item}
      layout
      initial={false}
      animate="visible"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

export function MotionItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const variants = useMotionVariants();

  return (
    <motion.div className={className} variants={variants.item}>
      {children}
    </motion.div>
  );
}

export function MotionCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const variants = useMotionVariants();

  return (
    <motion.article
      className={className}
      variants={variants.card}
      whileHover="hover"
      whileTap="tap"
    >
      {children}
    </motion.article>
  );
}

export function MotionDiv({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & Omit<HTMLMotionProps<"div">, "children" | "className">) {
  const variants = useMotionVariants();

  return (
    <motion.div
      {...props}
      className={className}
      variants={variants.card}
      whileHover="hover"
      whileTap="tap"
    >
      {children}
    </motion.div>
  );
}

export function MotionLink({
  children,
  className,
  href,
  target,
  rel,
  ariaCurrent,
}: {
  children: React.ReactNode;
  className?: string;
  href: string;
  target?: string;
  rel?: string;
  ariaCurrent?: "page";
}) {
  const variants = useMotionVariants();
  const motionProps: HTMLMotionProps<"span"> = {
    className: "motion-action",
    variants: variants.action,
    whileHover: "hover",
    whileTap: "tap",
  };

  if (href.startsWith("/")) {
    return (
      <motion.span {...motionProps}>
        <Link className={className} href={href} aria-current={ariaCurrent}>
          {children}
        </Link>
      </motion.span>
    );
  }

  return (
    <motion.span {...motionProps}>
      <a className={className} href={href} target={target} rel={rel} aria-current={ariaCurrent}>
        {children}
      </a>
    </motion.span>
  );
}

export function MotionHeadline({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const variants = useMotionVariants();

  return (
    <motion.div
      className={className}
      variants={variants.headline}
      initial="hidden"
      whileInView="visible"
      viewport={REVEAL_VIEWPORT}
    >
      {children}
    </motion.div>
  );
}

export function MotionHeroVisual({
  children,
  className,
  labelledBy,
}: {
  children: React.ReactNode;
  className?: string;
  labelledBy?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-18, 22]);
  const rotate = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-0.6, 0.6]);

  return (
    <motion.div
      ref={ref}
      className={className}
      aria-label={labelledBy}
      style={{ y, rotate }}
      variants={useMotionVariants().item}
      initial="hidden"
      whileInView="visible"
      viewport={REVEAL_VIEWPORT}
    >
      {children}
    </motion.div>
  );
}

export function MotionScrub({
  children,
  className,
  distance = 34,
  scaleTo = 1.035,
}: {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  scaleTo?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-distance, distance]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], reduceMotion ? [1, 1, 1] : [1, scaleTo, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0.72, 1, 1, 0.82]);

  return (
    <motion.div ref={ref} className={className} style={{ y, scale, opacity }}>
      {children}
    </motion.div>
  );
}

export function MotionAmbient({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      aria-hidden={!children}
      animate={
        reduceMotion
          ? undefined
          : {
              y: [0, -10, 0],
              rotate: [-0.4, 0.4, -0.4],
            }
      }
      transition={
        reduceMotion
          ? undefined
          : {
              duration: 7.5,
              ease: "easeInOut",
              repeat: Infinity,
            }
      }
    >
      {children}
    </motion.div>
  );
}
