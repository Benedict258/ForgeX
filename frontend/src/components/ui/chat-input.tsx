import * as React from "react";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ChatInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(({ className, ...props }, ref) => (
  <Textarea
    autoComplete="off"
    ref={ref}
    name="message"
    className={cn(
      "min-h-[160px] resize-none rounded-sm border-slate-700 bg-slate-950 px-5 py-5 text-base shadow-none focus-visible:ring-lime-300/60",
      className
    )}
    {...props}
  />
));

ChatInput.displayName = "ChatInput";

export { ChatInput };
