
import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className,
}) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };
  
  return (
    <div className="flex justify-center items-center">
      <div
        className={cn(
          "animate-spin rounded-full border-t-transparent border-solid border-travelcoop-500",
          sizeClasses[size],
          className
        )}
      />
    </div>
  );
};
