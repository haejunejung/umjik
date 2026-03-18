import { describe, it, expect, vi } from "vitest"
import { renderHook } from "@testing-library/react"
import { useReanimatedAdapter } from "./reanimated"
import type { StateDiff } from "../types/animation"

describe("useReanimatedAdapter", () => {
  it("returns an animatedStyle object", () => {
    const { result } = renderHook(() => useReanimatedAdapter([]))
    expect(result.current).toHaveProperty("animatedStyle")
    expect(typeof result.current.animatedStyle).toBe("object")
  })

  it("animatedStyle has opacity property", () => {
    const { result } = renderHook(() => useReanimatedAdapter([]))
    expect(result.current.animatedStyle).toHaveProperty("opacity")
  })

  it("animatedStyle has transform array", () => {
    const { result } = renderHook(() => useReanimatedAdapter([]))
    expect(result.current.animatedStyle).toHaveProperty("transform")
    expect(Array.isArray(result.current.animatedStyle.transform)).toBe(true)
  })

  it("does not call onComplete when diffs is empty", () => {
    const onComplete = vi.fn()
    renderHook(() => useReanimatedAdapter([], { onComplete }))
    expect(onComplete).not.toHaveBeenCalled()
  })

  it("calls onComplete after timing animation completes", async () => {
    const onComplete = vi.fn()
    const diffs: StateDiff[] = [
      {
        property: "opacity",
        from: 1,
        to: 0,
        transition: { type: "timing", duration: 300 },
      },
    ]
    renderHook(() => useReanimatedAdapter(diffs, { onComplete }))
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it("calls onComplete after spring animation completes", () => {
    const onComplete = vi.fn()
    const diffs: StateDiff[] = [
      {
        property: "translateX",
        from: 0,
        to: 100,
        transition: { type: "spring", stiffness: 100, damping: 10 },
      },
    ]
    renderHook(() => useReanimatedAdapter(diffs, { onComplete }))
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it("calls onComplete once after all animations in a batch complete", () => {
    const onComplete = vi.fn()
    const diffs: StateDiff[] = [
      {
        property: "opacity",
        from: 1,
        to: 0,
        transition: { type: "timing", duration: 300 },
      },
      {
        property: "translateX",
        from: 0,
        to: 100,
        transition: { type: "timing", duration: 300 },
      },
    ]
    renderHook(() => useReanimatedAdapter(diffs, { onComplete }))
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it("handles delay in transition config", () => {
    const onComplete = vi.fn()
    const diffs: StateDiff[] = [
      {
        property: "opacity",
        from: 1,
        to: 0,
        transition: { type: "timing", duration: 300, delay: 100 },
      },
    ]
    // Should not throw and onComplete fires because mock withDelay passes through immediately
    renderHook(() => useReanimatedAdapter(diffs, { onComplete }))
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it("skips unknown properties gracefully", () => {
    const onComplete = vi.fn()
    const diffs: StateDiff[] = [
      {
        property: "unknownProp",
        from: 0,
        to: 1,
        transition: { type: "timing", duration: 300 },
      },
    ]
    // Should not throw; onComplete not called since no valid sv was found
    expect(() => renderHook(() => useReanimatedAdapter(diffs, { onComplete }))).not.toThrow()
  })

  it('handles string "to" values by parsing float', () => {
    const onComplete = vi.fn()
    const diffs: StateDiff[] = [
      {
        property: "opacity",
        from: 1,
        to: "0.5",
        transition: { type: "timing", duration: 300 },
      },
    ]
    renderHook(() => useReanimatedAdapter(diffs, { onComplete }))
    expect(onComplete).toHaveBeenCalledTimes(1)
  })
})
