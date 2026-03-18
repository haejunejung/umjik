import { describe, it, expect } from "vitest"
import { renderHook } from "@testing-library/react"
import React from "react"
import { useContext } from "react"
import { PresenceContext } from "./PresenceContext"
import type { PresenceContextValue } from "../types/components"

describe("PresenceContext", () => {
  it("default value is null", () => {
    const { result } = renderHook(() => useContext(PresenceContext))
    expect(result.current).toBeNull()
  })

  it("can provide a custom value via Provider", () => {
    const value: PresenceContextValue = {
      status: "present",
      onExitComplete: () => {},
    }

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(PresenceContext.Provider, { value }, children)

    const { result } = renderHook(() => useContext(PresenceContext), { wrapper })
    expect(result.current).not.toBeNull()
    expect(result.current?.status).toBe("present")
  })

  it("provides status entering", () => {
    const value: PresenceContextValue = {
      status: "entering",
      onExitComplete: () => {},
    }

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(PresenceContext.Provider, { value }, children)

    const { result } = renderHook(() => useContext(PresenceContext), { wrapper })
    expect(result.current?.status).toBe("entering")
  })

  it("provides status exiting", () => {
    const value: PresenceContextValue = {
      status: "exiting",
      onExitComplete: () => {},
    }

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(PresenceContext.Provider, { value }, children)

    const { result } = renderHook(() => useContext(PresenceContext), { wrapper })
    expect(result.current?.status).toBe("exiting")
  })

  it("onExitComplete is callable", () => {
    const onExitComplete = () => {}
    const value: PresenceContextValue = { status: "exiting", onExitComplete }

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(PresenceContext.Provider, { value }, children)

    const { result } = renderHook(() => useContext(PresenceContext), { wrapper })
    expect(typeof result.current?.onExitComplete).toBe("function")
  })
})
