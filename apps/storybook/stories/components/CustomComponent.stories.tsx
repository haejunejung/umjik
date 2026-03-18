import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { View, Text, Pressable, StyleSheet } from "react-native"
import { createMotionComponent } from "../../../../packages/src/core/createMotionComponent"

const meta: Meta = {
  title: "Components/CustomComponent",
  decorators: [
    (Story) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
}

export default meta

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    minHeight: 300,
    backgroundColor: "#f9fafb",
  },
  pressableBox: {
    width: 100,
    height: 100,
    backgroundColor: "#f43f5e",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#f43f5e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  pressableLabel: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 12,
  },
  label: {
    marginTop: 12,
    fontSize: 12,
    color: "#9ca3af",
    letterSpacing: 0.3,
    textAlign: "center",
  },
})

const MotionPressable = createMotionComponent(Pressable)

/**
 * CustomComponent — wraps Pressable with createMotionComponent.
 * Tests that the factory pattern works for any RN component, not just the
 * built-in Motion.* shortcuts.
 */
export const CustomComponent: StoryObj = {
  render: () => {
    const [pressed, setPressed] = useState(false)

    return (
      <View style={{ alignItems: "center" }}>
        <MotionPressable
          animate={{ scale: pressed ? 0.92 : 1, opacity: pressed ? 0.75 : 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          style={styles.pressableBox}
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
        >
          <Text style={styles.pressableLabel}>HOLD ME</Text>
        </MotionPressable>
        <Text style={styles.label}>createMotionComponent(Pressable) · press and hold</Text>
      </View>
    )
  },
}
