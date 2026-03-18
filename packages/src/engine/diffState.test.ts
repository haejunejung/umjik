import { describe, it, expect } from "vitest"
import { diffState } from "./diffState"

describe("diffState", () => {
  it("returns diff for changed properties", () => {
    const diffs = diffState({ opacity: 1 }, { opacity: 0 }, undefined)
    expect(diffs).toHaveLength(1)
    expect(diffs[0].property).toBe("opacity")
    expect(diffs[0].from).toBe(1)
    expect(diffs[0].to).toBe(0)
  })

  it("skips properties with same values", () => {
    const diffs = diffState({ opacity: 1, translateX: 0 }, { opacity: 1, translateX: 0 }, undefined)
    expect(diffs).toHaveLength(0)
  })

  it("uses default from value when prev is undefined", () => {
    const diffs = diffState(undefined, { opacity: 0 }, undefined)
    expect(diffs[0].from).toBe(1) // default opacity is 1
  })

  it("uses default translateX from value of 0", () => {
    const diffs = diffState(undefined, { translateX: 100 }, undefined)
    expect(diffs[0].from).toBe(0)
  })

  it('uses default rotate from value of "0deg"', () => {
    const diffs = diffState(undefined, { rotate: "90deg" }, undefined)
    expect(diffs[0].from).toBe("0deg")
  })

  it("uses default scale from value of 1", () => {
    const diffs = diffState(undefined, { scale: 0.5 }, undefined)
    expect(diffs[0].from).toBe(1)
  })

  it("handles multiple changed properties", () => {
    const diffs = diffState(
      { opacity: 1, translateX: 0 },
      { opacity: 0, translateX: 100 },
      undefined,
    )
    expect(diffs).toHaveLength(2)
    const props = diffs.map((d) => d.property)
    expect(props).toContain("opacity")
    expect(props).toContain("translateX")
  })

  it("only diffs properties present in next state", () => {
    const diffs = diffState({ opacity: 1, scale: 1 }, { opacity: 0 }, undefined)
    expect(diffs).toHaveLength(1)
    expect(diffs[0].property).toBe("opacity")
  })

  it("includes resolved transition in each diff", () => {
    const diffs = diffState(undefined, { opacity: 0 }, { type: "timing", duration: 0.5 })
    expect(diffs[0].transition.type).toBe("timing")
    expect(diffs[0].transition.duration).toBe(500)
  })
})
