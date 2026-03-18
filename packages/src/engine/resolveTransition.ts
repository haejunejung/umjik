import { TransitionConfig, ResolvedTransitionConfig } from "../types/animation"

const PHYSICAL_PROPERTIES = new Set([
  "translateX",
  "translateY",
  "scale",
  "scaleX",
  "scaleY",
  "rotate",
])

export function resolveTransition(
  transition: TransitionConfig | undefined,
  property: string,
): ResolvedTransitionConfig {
  const propertyTransition = transition?.[property]
  const base =
    typeof propertyTransition === "object"
      ? { ...transition, ...propertyTransition }
      : transition || {}

  const type = base.type || (PHYSICAL_PROPERTIES.has(property) ? "spring" : "timing")

  const resolved: ResolvedTransitionConfig = { type }

  if (type === "timing") {
    resolved.duration = (base.duration ?? 0.3) * 1000
    resolved.easing = base.easing || "easeInOut"
  }

  if (type === "spring") {
    resolved.stiffness = base.stiffness ?? 100
    resolved.damping = base.damping ?? 10
    resolved.mass = base.mass ?? 1
  }

  if (base.delay !== undefined) {
    resolved.delay = base.delay * 1000
  }

  return resolved
}
