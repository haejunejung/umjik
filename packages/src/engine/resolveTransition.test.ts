import { describe, it, expect } from "vitest"
import { resolveTransition } from "./resolveTransition"

describe("resolveTransition", () => {
  it("converts duration 0.3 to 300ms for timing", () => {
    const result = resolveTransition({ type: "timing", duration: 0.3 }, "opacity")
    expect(result.duration).toBe(300)
  })

  it("defaults opacity to timing type", () => {
    const result = resolveTransition(undefined, "opacity")
    expect(result.type).toBe("timing")
  })

  it("defaults translateX to spring type", () => {
    const result = resolveTransition(undefined, "translateX")
    expect(result.type).toBe("spring")
  })

  it("defaults translateY to spring type", () => {
    const result = resolveTransition(undefined, "translateY")
    expect(result.type).toBe("spring")
  })

  it("defaults scale to spring type", () => {
    const result = resolveTransition(undefined, "scale")
    expect(result.type).toBe("spring")
  })

  it("defaults rotate to spring type", () => {
    const result = resolveTransition(undefined, "rotate")
    expect(result.type).toBe("spring")
  })

  it("uses default spring values when no config provided", () => {
    const result = resolveTransition(undefined, "translateX")
    expect(result.stiffness).toBe(100)
    expect(result.damping).toBe(10)
    expect(result.mass).toBe(1)
  })

  it("uses default timing duration of 300ms when no duration provided", () => {
    const result = resolveTransition(undefined, "opacity")
    expect(result.duration).toBe(300)
  })

  it("uses default easing easeInOut when no easing provided", () => {
    const result = resolveTransition(undefined, "opacity")
    expect(result.easing).toBe("easeInOut")
  })

  it("supports per-property transition override", () => {
    const result = resolveTransition(
      { type: "timing", duration: 0.5, translateX: { type: "spring", stiffness: 200 } },
      "translateX",
    )
    expect(result.type).toBe("spring")
    expect(result.stiffness).toBe(200)
  })

  it("converts delay from seconds to milliseconds", () => {
    const result = resolveTransition({ delay: 0.5 }, "opacity")
    expect(result.delay).toBe(500)
  })

  it("does not include delay when not specified", () => {
    const result = resolveTransition({}, "opacity")
    expect(result.delay).toBeUndefined()
  })
})
