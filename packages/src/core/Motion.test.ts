import { describe, it, expect } from "vitest"
import { Motion } from "./Motion"
import { createMotionComponent } from "./createMotionComponent"

describe("Motion", () => {
  it("Motion.View exists and is a component", () => {
    expect(Motion.View).toBeDefined()
    expect(typeof Motion.View).toBe("function")
  })

  it("Motion.Text exists and is a component", () => {
    expect(Motion.Text).toBeDefined()
    expect(typeof Motion.Text).toBe("function")
  })

  it("Motion.Image exists and is a component", () => {
    expect(Motion.Image).toBeDefined()
    expect(typeof Motion.Image).toBe("function")
  })

  it("Motion.ScrollView exists and is a component", () => {
    expect(Motion.ScrollView).toBeDefined()
    expect(typeof Motion.ScrollView).toBe("function")
  })

  it("Motion.create is the createMotionComponent function", () => {
    expect(Motion.create).toBe(createMotionComponent)
  })

  it("Motion.View has correct displayName", () => {
    expect(Motion.View.displayName).toBe("Motion(View)")
  })

  it("Motion.Text has correct displayName", () => {
    expect(Motion.Text.displayName).toBe("Motion(Text)")
  })

  it("Motion.Image has correct displayName", () => {
    expect(Motion.Image.displayName).toBe("Motion(Image)")
  })

  it("Motion.ScrollView has correct displayName", () => {
    expect(Motion.ScrollView.displayName).toBe("Motion(ScrollView)")
  })
})
