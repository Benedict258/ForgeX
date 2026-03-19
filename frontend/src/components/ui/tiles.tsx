import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface TilesProps {
  className?: string;
  rows?: number;
  cols?: number;
  tileClassName?: string;
}

export function Tiles({ className, rows = 10, cols = 10, tileClassName }: TilesProps) {
  const items = Array.from({ length: rows * cols });

  return (
    <div className={cn("pointer-events-none absolute inset-0 grid opacity-50", className)} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {items.map((_, index) => (
        <motion.div
          key={index}
          whileHover={{ backgroundColor: "rgba(190, 242, 100, 0.14)" }}
          animate={{ opacity: [0.18, 0.42, 0.18] }}
          transition={{ duration: 5 + (index % 7), repeat: Infinity, ease: "easeInOut" }}
          className={cn("aspect-square border border-white/5 bg-white/[0.02]", tileClassName)}
        />
      ))}
    </div>
  );
}
