import { createContext } from "react"
import { PresenceContextValue } from "../types/components"

export const PresenceContext = createContext<PresenceContextValue | null>(null)
