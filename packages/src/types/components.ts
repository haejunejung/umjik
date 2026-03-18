import { AnimationState, TransitionConfig } from "./animation"

export interface MotionProps {
  initial?: AnimationState | string | boolean
  animate?: AnimationState | string
  exit?: AnimationState | string
  transition?: TransitionConfig
  variants?: Record<string, AnimationState>
  onAnimationComplete?: () => void
}

export interface AnimatePresenceProps {
  children: React.ReactNode
  mode?: "sync" | "wait"
  onExitComplete?: () => void
}

export interface PresenceContextValue {
  status: "entering" | "present" | "exiting"
  onExitComplete: () => void
}
