import { AnimationState, ResolvedAnimationState } from "../types/animation"

const PROPERTY_MAP: Record<string, string> = {
  x: "translateX",
  y: "translateY",
}

export function resolveAnimation(
  state: AnimationState | undefined,
): ResolvedAnimationState | undefined {
  if (!state) return undefined

  const resolved: ResolvedAnimationState = {}

  for (const [key, value] of Object.entries(state)) {
    const mappedKey = PROPERTY_MAP[key] || key

    if (PROPERTY_MAP[key] && resolved[mappedKey as keyof ResolvedAnimationState] !== undefined) {
      continue
    }

    if (mappedKey === "rotate" && typeof value === "number") {
      ;(resolved as any)[mappedKey] = `${value}deg`
    } else {
      ;(resolved as any)[mappedKey] = value
    }
  }

  return resolved
}
