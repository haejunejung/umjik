import React, { useState, useEffect, useRef, useCallback, Children, isValidElement } from "react"
import { AnimatePresenceProps } from "../types/components"
import { PresenceContext } from "../context/PresenceContext"

interface ChildState {
  key: string
  element: React.ReactElement
  status: "entering" | "present" | "exiting"
}

function getChildrenMap(children: React.ReactNode): Map<string, React.ReactElement> {
  const map = new Map<string, React.ReactElement>()
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.key != null) {
      map.set(String(child.key), child)
    }
  })
  return map
}

export function AnimatePresence({ children, mode = "sync", onExitComplete }: AnimatePresenceProps) {
  const [presentChildren, setPresentChildren] = useState<ChildState[]>([])
  const prevChildrenMap = useRef<Map<string, React.ReactElement>>(new Map())
  const isInitialRender = useRef(true)

  useEffect(() => {
    const nextMap = getChildrenMap(children)
    const prevMap = prevChildrenMap.current
    const newPresent: ChildState[] = []

    nextMap.forEach((element, key) => {
      if (prevMap.has(key)) {
        newPresent.push({ key, element, status: "present" })
      } else {
        newPresent.push({
          key,
          element,
          status: isInitialRender.current ? "present" : "entering",
        })
      }
    })

    prevMap.forEach((element, key) => {
      if (!nextMap.has(key)) {
        newPresent.push({ key, element, status: "exiting" })
      }
    })

    setPresentChildren(newPresent)
    prevChildrenMap.current = nextMap
    isInitialRender.current = false
  }, [children])

  const handleExitComplete = useCallback(
    (key: string) => {
      setPresentChildren((prev) => {
        const next = prev.filter((child) => child.key !== key)
        const hasExiting = next.some((c) => c.status === "exiting")
        if (!hasExiting) {
          onExitComplete?.()
        }
        return next
      })
    },
    [onExitComplete],
  )

  const isAnyExiting = presentChildren.some((c) => c.status === "exiting")
  const childrenToRender =
    mode === "wait" && isAnyExiting
      ? presentChildren.filter((c) => c.status !== "entering")
      : presentChildren

  return (
    <>
      {childrenToRender.map((child) => (
        <PresenceContext.Provider
          key={child.key}
          value={{
            status: child.status,
            onExitComplete: () => handleExitComplete(child.key),
          }}
        >
          {child.element}
        </PresenceContext.Provider>
      ))}
    </>
  )
}
