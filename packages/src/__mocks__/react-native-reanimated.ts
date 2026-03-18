export const useSharedValue = (initial: number) => ({
  value: initial,
})

export const useAnimatedStyle = (fn: () => any) => {
  return fn()
}

export const withTiming = (value: number, config?: any, cb?: (finished?: boolean) => void) => {
  cb?.(true)
  return value
}

export const withSpring = (value: number, config?: any, cb?: (finished?: boolean) => void) => {
  cb?.(true)
  return value
}

export const withDelay = (_ms: number, animation: any) => animation

export const Easing = {
  linear: "linear",
  ease: "ease",
  in: (e: any) => e,
  out: (e: any) => e,
  inOut: (e: any) => e,
  bezier: (a: number, b: number, c: number, d: number) => [a, b, c, d],
}

export const runOnJS =
  (fn: Function) =>
  (...args: any[]) =>
    fn(...args)

const Animated = {
  createAnimatedComponent: (Component: any) => Component,
  SharedValue: {},
}

export default Animated
