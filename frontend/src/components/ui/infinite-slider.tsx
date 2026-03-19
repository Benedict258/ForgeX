import { animate, motion, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import useMeasure from "react-use-measure";

import { cn } from "@/lib/utils";

type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  duration?: number;
  durationOnHover?: number;
  className?: string;
};

export function InfiniteSlider({
  children,
  gap = 24,
  duration = 24,
  durationOnHover = 40,
  className
}: InfiniteSliderProps) {
  const [currentDuration, setCurrentDuration] = useState(duration);
  const [ref, { width }] = useMeasure();
  const translation = useMotionValue(0);
  const [key, setKey] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const contentSize = width + gap;
    const from = 0;
    const to = -contentSize / 2;
    const controls = animate(translation, [isTransitioning ? translation.get() : from, to], {
      ease: "linear",
      duration: isTransitioning
        ? currentDuration * Math.abs((translation.get() - to) / contentSize)
        : currentDuration,
      repeat: isTransitioning ? 0 : Infinity,
      onComplete: () => {
        if (isTransitioning) {
          setIsTransitioning(false);
          setKey((current) => current + 1);
        }
      },
      onRepeat: () => {
        translation.set(from);
      }
    });

    return controls.stop;
  }, [currentDuration, gap, isTransitioning, key, translation, width]);

  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        ref={ref}
        className="flex w-max"
        style={{ x: translation, gap: `${gap}px` }}
        onHoverStart={() => {
          setIsTransitioning(true);
          setCurrentDuration(durationOnHover);
        }}
        onHoverEnd={() => {
          setIsTransitioning(true);
          setCurrentDuration(duration);
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
