"use client";

import { motion } from "framer-motion";
import { useMotionVariants } from "@/lib/variants";

export function MotionMain({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const variants = useMotionVariants();

  return (
    <motion.main
      className={className}
      variants={variants.page}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.main>
  );
}

export function MotionSection({
  children,
  className,
  id,
  labelledBy,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  labelledBy?: string;
}) {
  const variants = useMotionVariants();

  return (
    <motion.section
      id={id}
      className={className}
      aria-labelledby={labelledBy}
      variants={variants.section}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.section>
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

export function MotionHeadline({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const variants = useMotionVariants();

  return (
    <motion.div className={className} variants={variants.headline}>
      {children}
    </motion.div>
  );
}
