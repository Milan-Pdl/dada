import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddings = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export default function Card({ children, className = "", hover, padding = "md" }: Props) {
  return (
    <div
      className={`
        bg-white rounded-2xl border border-ink-100/60 shadow-soft
        ${hover ? "hover:shadow-card hover:border-ink-200/60 transition-all duration-200" : ""}
        ${paddings[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
