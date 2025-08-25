import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Textarea = forwardRef(({ 
  className, 
  error,
  rows = 3,
  ...props 
}, ref) => {
  return (
    <textarea
      className={cn(
        "input-field resize-vertical",
        error && "border-red-500 focus:ring-red-500 focus:border-red-500",
        className
      )}
      rows={rows}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export default Textarea;