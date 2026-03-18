import { describe, it, expect } from "vitest"
import { resolveAnimation } from "./resolveAnimation"

describe("resolveAnimation", () => {
  it("maps x to translateX", () => {
    expect(resolveAnimation({ x: 100 })).toEqual({ translateX: 100 })
  })

  it("maps y to translateY", () => {
    expect(resolveAnimation({ y: 50 })).toEqual({ translateY: 50 })
  })

  it("converts rotate number to deg string", () => {
    expect(resolveAnimation({ rotate: 90 })).toEqual({ rotate: "90deg" })
  })

  it("explicit translateX overrides x when translateX appears after x", () => {
    // x maps to translateX=100, but then the explicit translateX=50 key is NOT in PROPERTY_MAP
    // so the guard does not apply — translateX=50 overwrites the mapped value
    const result = resolveAnimation({ x: 100, translateX: 50 })
    expect(result?.translateX).toBe(50)
  })

  it("passes through opacity unchanged", () => {
    expect(resolveAnimation({ opacity: 0.5 })).toEqual({ opacity: 0.5 })
  })

  it("passes through scale unchanged", () => {
    expect(resolveAnimation({ scale: 1.5 })).toEqual({ scale: 1.5 })
  })

  it("returns undefined for undefined input", () => {
    expect(resolveAnimation(undefined)).toBeUndefined()
  })

  it("handles multiple properties together", () => {
    const result = resolveAnimation({ x: 10, y: 20, opacity: 0.8, rotate: 45 })
    expect(result).toEqual({
      translateX: 10,
      translateY: 20,
      opacity: 0.8,
      rotate: "45deg",
    })
  })
})
