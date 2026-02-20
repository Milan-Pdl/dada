import { ReactNode } from "react";

type Variant = "default" | "accent" | "success" | "warn" | "danger" | "outline";

const variants: Record<Variant, string> = {
  default: "bg-surface-2 text-ink-700",
  accent: "bg-accent-muted text-accent-dark",
  success: "bg-success-light text-success",
  warn: "bg-warn-light text-warn",
  danger: "bg-danger-light text-danger",
  outline: "bg-transparent border border-ink-100 text-ink-500",
};

interface Props {
  children: ReactNode;
  variant?: Variant;
  dot?: boolean;
  className?: string;
}

export default function Badge({ children, variant = "default", dot, className = "" }: Props) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium tracking-wide ${variants[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${variant === "success" ? "bg-success" : variant === "danger" ? "bg-danger" : variant === "warn" ? "bg-warn" : "bg-accent"}`} />}
      {children}
    </span>
  );
}
