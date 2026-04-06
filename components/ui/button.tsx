import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "accent";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-foreground text-background hover:opacity-85 active:scale-[0.98]":
              variant === "primary",
            "border border-border/60 text-foreground hover:bg-muted/40 hover:border-border active:scale-[0.98]":
              variant === "secondary",
            "text-muted-foreground hover:text-foreground":
              variant === "ghost",
            "bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.98] font-semibold":
              variant === "accent",
          },
          {
            "text-xs px-3 py-1.5": size === "sm",
            "text-sm px-5 py-2.5": size === "md",
            "text-sm px-7 py-3.5": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export { Button };
