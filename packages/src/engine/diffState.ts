import { ResolvedAnimationState, TransitionConfig, StateDiff } from "../types/animation"
import { resolveTransition } from "./resolveTransition"

export function diffState(
  prev: ResolvedAnimationState | undefined,
  next: ResolvedAnimationState,
  transition: TransitionConfig | undefined,
): StateDiff[] {
  const diffs: StateDiff[] = []

  for (const [property, toValue] of Object.entries(next)) {
    const fromValue = prev?.[property as keyof ResolvedAnimationState]
    if (fromValue === toValue) continue

    diffs.push({
      property,
      from: fromValue ?? getDefaultValue(property),
      to: toValue,
      transition: resolveTransition(transition, property),
    })
  }

  return diffs
}

function getDefaultValue(property: string): any {
  switch (property) {
    case "opacity":
      return 1
    case "scale":
    case "scaleX":
    case "scaleY":
      return 1
    case "translateX":
    case "translateY":
      return 0
    case "rotate":
      return "0deg"
    case "borderRadius":
    case "borderWidth":
      return 0
    default:
      return 0
  }
}
