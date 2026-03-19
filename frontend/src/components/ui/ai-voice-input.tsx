import { Mic } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface AIVoiceInputProps {
  onStart?: () => void;
  onStop?: (duration: number) => void;
  visualizerBars?: number;
  active?: boolean;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function AIVoiceInput({
  onStart,
  onStop,
  visualizerBars = 32,
  active = false,
  label = "Click to speak",
  disabled = false,
  className
}: AIVoiceInputProps) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let intervalId: number | undefined;

    if (active) {
      onStart?.();
      intervalId = window.setInterval(() => {
        setTime((current) => current + 1);
      }, 1000);
    } else {
      if (time > 0) {
        onStop?.(time);
      }
      setTime(0);
    }

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [active]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={cn("w-full rounded-sm border border-slate-700 bg-slate-950 p-5", className)}>
      <div className="relative mx-auto flex w-full max-w-xl flex-col items-center gap-3">
        <button
          className={cn(
            "group flex h-16 w-16 items-center justify-center rounded-sm border border-slate-700 transition-colors",
            active
              ? "bg-lime-300 text-slate-950"
              : "bg-slate-950 text-slate-200 hover:bg-slate-900",
            disabled ? "cursor-not-allowed opacity-50" : ""
          )}
          type="button"
          disabled={disabled}
        >
          {active ? <div className="h-5 w-5 animate-pulse rounded-sm bg-slate-950" /> : <Mic className="h-6 w-6" />}
        </button>

        <span className={cn("font-mono text-sm", active ? "text-slate-200" : "text-slate-500")}>
          {formatTime(time)}
        </span>

        <div className="flex h-10 w-full max-w-xs items-end justify-center gap-1">
          {[...Array(visualizerBars)].map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-1 transition-all duration-300",
                active ? "animate-pulse bg-lime-300/80" : "h-2 bg-slate-700"
              )}
              style={active ? { height: `${22 + ((index * 13) % 70)}%`, animationDelay: `${index * 0.03}s` } : undefined}
            />
          ))}
        </div>

        <p className={cn("text-xs", active ? "text-slate-200" : "text-slate-400")}>{label}</p>
      </div>
    </div>
  );
}
