import React from "react"

const createMockComponent = (name: string) => {
  const Component = React.forwardRef((props: any, ref: any) => {
    return React.createElement(name, { ...props, ref })
  })
  Component.displayName = name
  return Component
}

export const View = createMockComponent("View")
export const Text = createMockComponent("Text")
export const Image = createMockComponent("Image")
export const ScrollView = createMockComponent("ScrollView")
export const Pressable = createMockComponent("Pressable")
