import { useEffect, useMemo, useRef } from "react"
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  runOnJS,
  Easing,
} from "react-native-reanimated"
import { StateDiff, EasingFunction } from "../types/animation"

type SharedValue<T> = { value: T }

// -- Animatable property defaults --
// To add a new property: add default here, add useSharedValue call, add to sharedValues map, add to useAnimatedStyle.
const DEFAULTS = {
  translateX: 0,
  translateY: 0,
  scale: 1,
  scaleX: 1,
  scaleY: 1,
  rotate: 0,
  opacity: 1,
  width: 0,
  height: 0,
  borderRadius: 0,
} as const

function mapEasing(easing: EasingFunction | undefined) {
  if (!easing) return Easing.inOut(Easing.ease)
  if (Array.isArray(easing)) return Easing.bezier(easing[0], easing[1], easing[2], easing[3])
  switch (easing) {
    case "linear":
      return Easing.linear
    case "easeIn":
      return Easing.in(Easing.ease)
    case "easeOut":
      return Easing.out(Easing.ease)
    case "easeInOut":
      return Easing.inOut(Easing.ease)
    default:
      return Easing.inOut(Easing.ease)
  }
}

export function useReanimatedAdapter(diffs: StateDiff[], options?: { onComplete?: () => void }) {
  const translateX = useSharedValue(DEFAULTS.translateX)
  const translateY = useSharedValue(DEFAULTS.translateY)
  const scale = useSharedValue(DEFAULTS.scale)
  const scaleX = useSharedValue(DEFAULTS.scaleX)
  const scaleY = useSharedValue(DEFAULTS.scaleY)
  const rotate = useSharedValue(DEFAULTS.rotate)
  const opacity = useSharedValue(DEFAULTS.opacity)
  const width = useSharedValue(DEFAULTS.width)
  const height = useSharedValue(DEFAULTS.height)
  const borderRadius = useSharedValue(DEFAULTS.borderRadius)

  const sharedValues = useMemo<Record<string, SharedValue<number>>>(
    () => ({
      translateX,
      translateY,
      scale,
      scaleX,
      scaleY,
      rotate,
      opacity,
      width,
      height,
      borderRadius,
    }),
    [translateX, translateY, scale, scaleX, scaleY, rotate, opacity, width, height, borderRadius],
  )

  const onCompleteRef = useRef(options?.onComplete)
  onCompleteRef.current = options?.onComplete

  useEffect(() => {
    if (diffs.length === 0) return

    let completedCount = 0
    const totalAnimations = diffs.length

    const handleComplete = (_finished?: boolean) => {
      completedCount++
      if (completedCount >= totalAnimations && onCompleteRef.current) {
        runOnJS(onCompleteRef.current)()
      }
    }

    for (const diff of diffs) {
      const sv = sharedValues[diff.property]
      if (!sv) continue

      const { transition } = diff
      const toValue = typeof diff.to === "string" ? parseFloat(diff.to) : diff.to

      let animation
      if (transition.type === "spring") {
        animation = withSpring(
          toValue,
          {
            stiffness: transition.stiffness,
            damping: transition.damping,
            mass: transition.mass,
          },
          handleComplete,
        )
      } else {
        animation = withTiming(
          toValue,
          {
            duration: transition.duration,
            easing: mapEasing(transition.easing),
          },
          handleComplete,
        )
      }

      if (transition.delay) {
        sv.value = withDelay(transition.delay, animation)
      } else {
        sv.value = animation
      }
    }
  }, [diffs, sharedValues])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      width: width.value || undefined,
      height: height.value || undefined,
      borderRadius: borderRadius.value,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { scaleX: scaleX.value },
        { scaleY: scaleY.value },
        { rotate: `${rotate.value}deg` },
      ],
    }
  })

  return { animatedStyle }
}
