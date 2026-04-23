import { cn } from "@/lib/utils";
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent transition-colors",
            error && "border-red-500/60 focus:border-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent transition-colors resize-y min-h-[140px]",
            error && "border-red-500/60 focus:border-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Input, Textarea };
