import { cn } from "@/lib/utils";
import { ProductStatus } from "@/types";

const statusConfig: Record<ProductStatus, { label: string; dot: string; className: string }> = {
  prototype: {
    label: "Prototype",
    dot: "bg-violet-400",
    className: "bg-violet-500/8 text-violet-400/80 border-violet-500/15",
  },
  "in-development": {
    label: "In Development",
    dot: "bg-amber-400",
    className: "bg-amber-500/8 text-amber-400/80 border-amber-500/15",
  },
  released: {
    label: "Released",
    dot: "bg-emerald-400",
    className: "bg-emerald-500/8 text-emerald-400/80 border-emerald-500/15",
  },
  concept: {
    label: "Concept",
    dot: "bg-zinc-400",
    className: "bg-zinc-500/8 text-zinc-400/80 border-zinc-500/15",
  },
};

interface BadgeProps {
  status: ProductStatus;
  className?: string;
}

export function Badge({ status, className }: BadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-lg border",
        config.className,
        className
      )}
    >
      <span className={cn("w-1 h-1 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}
