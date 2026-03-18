import React, { useContext, useMemo, useRef } from "react"
import Animated from "react-native-reanimated"
import { MotionProps } from "../types/components"
import { resolveAnimation } from "../engine/resolveAnimation"
import { resolveVariants } from "../engine/resolveVariants"
import { diffState } from "../engine/diffState"
import { useReanimatedAdapter } from "../adapters/reanimated"
import { PresenceContext } from "../context/PresenceContext"

export function createMotionComponent<P extends object>(Component: React.ComponentType<P>) {
  let AnimatedComponent: React.ComponentType<any> | null = null

  function getAnimatedComponent() {
    if (!AnimatedComponent) {
      AnimatedComponent = Animated.createAnimatedComponent(Component)
    }
    return AnimatedComponent
  }

  function MotionComponent(props: P & MotionProps) {
    const Comp = getAnimatedComponent()
    const { initial, animate, exit, transition, variants, onAnimationComplete, style, ...rest } =
      props as any

    const presence = useContext(PresenceContext)

    const resolvedInitial = resolveVariants(initial, variants)
    const resolvedAnimate = resolveVariants(animate, variants)
    const resolvedExit = resolveVariants(exit, variants)

    const target = presence?.status === "exiting" ? resolvedExit : resolvedAnimate

    const resolvedTarget = resolveAnimation(target)
    const resolvedInitialState = resolveAnimation(
      typeof initial === "boolean" ? undefined : resolvedInitial,
    )

    const prevStateRef = useRef(resolvedInitialState)

    const diffs = useMemo(() => {
      if (!resolvedTarget) return []
      const result = diffState(prevStateRef.current, resolvedTarget, transition)
      prevStateRef.current = resolvedTarget
      return result
    }, [resolvedTarget, transition])

    const { animatedStyle } = useReanimatedAdapter(diffs, {
      onComplete: () => {
        if (presence?.status === "exiting") {
          presence.onExitComplete()
        }
        onAnimationComplete?.()
      },
    })

    return <Comp style={[style, animatedStyle]} {...(rest as any)} />
  }

  MotionComponent.displayName = `Motion(${Component.displayName || Component.name || "Component"})`

  return MotionComponent
}
