import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classes do Tailwind CSS de forma inteligente,
 * eliminando duplicações e conflitos.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
