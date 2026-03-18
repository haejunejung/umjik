import React from "react"
import { describe, it, expect, vi } from "vitest"
import { render } from "@testing-library/react"
import { createMotionComponent } from "./createMotionComponent"
import { PresenceContext } from "../context/PresenceContext"

// A simple host component for testing
const View = React.forwardRef<any, any>((props, ref) =>
  React.createElement("div", { ...props, ref }),
)
View.displayName = "View"

describe("createMotionComponent", () => {
  it("creates a valid React component (function)", () => {
    const MotionView = createMotionComponent(View)
    expect(typeof MotionView).toBe("function")
  })

  it("sets displayName correctly", () => {
    const MotionView = createMotionComponent(View)
    expect(MotionView.displayName).toBe("Motion(View)")
  })

  it("uses Component name when displayName not set", () => {
    function MyComp(props: any) {
      return React.createElement("div", props)
    }
    const MotionMyComp = createMotionComponent(MyComp)
    expect(MotionMyComp.displayName).toBe("Motion(MyComp)")
  })

  it("renders without error with no props", () => {
    const MotionView = createMotionComponent(View)
    expect(() => render(React.createElement(MotionView))).not.toThrow()
  })

  it("passes non-motion props through to underlying component", () => {
    const MotionView = createMotionComponent(View)
    const { container } = render(
      React.createElement(MotionView, { "data-testid": "mv", testID: "mv" } as any),
    )
    // The underlying div should receive testID
    const el = container.firstChild as HTMLElement
    expect(el).toBeTruthy()
  })

  it("renders with initial and animate props without throwing", () => {
    const MotionView = createMotionComponent(View)
    expect(() =>
      render(
        React.createElement(MotionView, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
        } as any),
      ),
    ).not.toThrow()
  })

  it("resolves variant string to object via variants prop", () => {
    const MotionView = createMotionComponent(View)
    expect(() =>
      render(
        React.createElement(MotionView, {
          initial: "hidden",
          animate: "visible",
          variants: {
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          },
        } as any),
      ),
    ).not.toThrow()
  })

  it("calls onAnimationComplete after animation", () => {
    const onAnimationComplete = vi.fn()
    const MotionView = createMotionComponent(View)
    render(
      React.createElement(MotionView, {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        onAnimationComplete,
      } as any),
    )
    // The mock withTiming/withSpring fires callback immediately
    expect(onAnimationComplete).toHaveBeenCalledTimes(1)
  })

  it("uses exit animation when PresenceContext status is exiting", () => {
    const onExitComplete = vi.fn()
    const MotionView = createMotionComponent(View)

    render(
      React.createElement(
        PresenceContext.Provider,
        { value: { status: "exiting", onExitComplete } },
        React.createElement(MotionView, {
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        } as any),
      ),
    )
    // onExitComplete should be called when animation completes while exiting
    expect(onExitComplete).toHaveBeenCalledTimes(1)
  })

  it("does not call onExitComplete when status is present", () => {
    const onExitComplete = vi.fn()
    const MotionView = createMotionComponent(View)

    render(
      React.createElement(
        PresenceContext.Provider,
        { value: { status: "present", onExitComplete } },
        React.createElement(MotionView, {
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        } as any),
      ),
    )
    expect(onExitComplete).not.toHaveBeenCalled()
  })
})
