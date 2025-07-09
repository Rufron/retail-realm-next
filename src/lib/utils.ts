import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


// Utility function to simplify conditional class merging in components
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))// Combines inputs, resolves conflicts, and returns optimized class string
}
