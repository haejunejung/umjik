import { describe, it, expect, vi } from "vitest"
import { resolveVariants } from "./resolveVariants"

describe("resolveVariants", () => {
  const variants = {
    visible: { opacity: 1, scale: 1 },
    hidden: { opacity: 0, scale: 0.8 },
  }

  it("resolves string key to variant object", () => {
    expect(resolveVariants("visible", variants)).toEqual({ opacity: 1, scale: 1 })
  })

  it("resolves another string key", () => {
    expect(resolveVariants("hidden", variants)).toEqual({ opacity: 0, scale: 0.8 })
  })

  it("returns undefined for missing variant and warns", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const result = resolveVariants("nonexistent", variants)
    expect(result).toBeUndefined()
    warn.mockRestore()
  })

  it("passes through object value directly", () => {
    const state = { opacity: 0.5 }
    expect(resolveVariants(state, variants)).toBe(state)
  })

  it("returns undefined for undefined value", () => {
    expect(resolveVariants(undefined, variants)).toBeUndefined()
  })

  it("returns undefined for false value", () => {
    expect(resolveVariants(false, variants)).toBeUndefined()
  })

  it("returns undefined for true value", () => {
    expect(resolveVariants(true, variants)).toBeUndefined()
  })

  it("returns undefined when variants is undefined and value is string", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    const result = resolveVariants("visible", undefined)
    expect(result).toBeUndefined()
    warn.mockRestore()
  })
})
