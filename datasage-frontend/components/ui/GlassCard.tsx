"use client";
import { motion, MotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
  variant?: "light" | "dark" | "colored";
  hover?: boolean;
}

export function GlassCard({
  children,
  className,
  variant = "dark",
  hover = false,
  ...props
}: GlassCardProps) {
  const variants = {
    light: "bg-glass-white border-border-glass",
    dark: "bg-glass-dark border-white/10",
    colored: "bg-gradient-to-br from-white/10 to-white/5 border-border-glass",
  };
  return (
    <motion.div
      className={cn(
        "rounded-2xl border backdrop-blur-glass shadow-glass overflow-hidden",
        variants[variant],
        className,
      )}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}
