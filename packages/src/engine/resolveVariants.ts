import { AnimationState } from "../types/animation"

export function resolveVariants(
  value: AnimationState | string | boolean | undefined,
  variants: Record<string, AnimationState> | undefined,
): AnimationState | undefined {
  if (value === undefined || value === false) return undefined
  if (value === true) return undefined
  if (typeof value !== "string") return value

  if (!variants || !variants[value]) {
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.warn(`[umjik] Variant "${value}" not found in variants.`)
    }
    return undefined
  }

  return variants[value]
}
