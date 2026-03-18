// framer-motion 호환 속성 (사용자 입력)
export interface AnimationState {
  x?: number
  y?: number
  rotate?: number
  scale?: number
  scaleX?: number
  scaleY?: number
  opacity?: number
  translateX?: number
  translateY?: number
  backgroundColor?: string
  width?: number
  height?: number
  borderRadius?: number
  borderWidth?: number
}

export interface ResolvedAnimationState {
  translateX?: number
  translateY?: number
  rotate?: string
  scale?: number
  scaleX?: number
  scaleY?: number
  opacity?: number
  backgroundColor?: string
  width?: number
  height?: number
  borderRadius?: number
  borderWidth?: number
}

export type EasingFunction =
  | "linear"
  | "easeIn"
  | "easeOut"
  | "easeInOut"
  | [number, number, number, number]

export interface TransitionConfig {
  type?: "timing" | "spring"
  duration?: number
  easing?: EasingFunction
  stiffness?: number
  damping?: number
  mass?: number
  bounce?: number
  delay?: number
  [property: string]: TransitionConfig | any
}

export interface ResolvedTransitionConfig {
  type: "timing" | "spring"
  duration?: number
  easing?: EasingFunction
  stiffness?: number
  damping?: number
  mass?: number
  delay?: number
}

export interface StateDiff {
  property: string
  from: any
  to: any
  transition: ResolvedTransitionConfig
}
