import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import { getStatusColor } from "@/utils/formatUtils";

const Badge = forwardRef(({ 
  className, 
  variant = "default",
  status,
  children, 
  ...props 
}, ref) => {
  const baseStyles = "status-badge";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary-100 text-primary-800",
    secondary: "bg-secondary-100 text-secondary-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800"
  };

  const statusClass = status ? getStatusColor(status) : variants[variant];

  return (
    <span
      className={cn(
        baseStyles,
        statusClass,
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;