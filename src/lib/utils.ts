import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  // To merge tailwind classes
  return twMerge(clsx(inputs))
}
