import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const validateUrl = (url: string): boolean => {
  try {
    const u = new URL(url);
    if (!u.host || (u.protocol !== "http:" && u.protocol !== "https:")) {
      return false;
    }

    return true;
  } catch (_) {
    return false;
  }
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isDev = () => {
  return import.meta.env.DEV;
};
