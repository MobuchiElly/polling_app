import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function: cn (className)
 *
 * Combines multiple conditional class names into a single valid Tailwind CSS class string.
 * - Uses `clsx` to handle conditional class logic (truthy/falsey values, arrays, objects).
 * - Uses `tailwind-merge` to intelligently merge and deduplicate conflicting Tailwind classes.
 *
 * Example:
 * cn("px-2 py-1", condition && "bg-blue-500", "px-4")
 * => "py-1 bg-blue-500 px-4"
 *   (notice how `px-2` is removed since `tailwind-merge` prefers the later `px-4`)
 *
 * Why it’s needed:
 * - Writing dynamic class strings with lots of conditions can get messy.
 * - Tailwind classes often conflict (e.g., `px-2` vs `px-4`), and without merging
 *   you’d accidentally apply both, causing unpredictable styling.
 * - Centralizes logic so components stay clean and readable.
 *
 * Assumptions:
 * - Inputs are valid Tailwind classes or falsy values (e.g. `null`, `undefined`, `false`).
 *
 * Edge Cases:
 * - If no arguments are passed, it returns an empty string.
 * - If the same class appears multiple times, only the **last one wins** (thanks to `twMerge`).
 *
 * Connections:
 * - Used in UI components to cleanly handle conditional styles
 *   (buttons, cards, alerts, etc.).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}