import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { View, Text, Pressable, StyleSheet } from "react-native"
import { Motion } from "../../../../packages/src/core/Motion"

const meta: Meta = {
  title: "Transition/VariantToggle",
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
  toggleTrack: {
    width: 56,
    height: 30,
    borderRadius: 15,
    padding: 3,
    justifyContent: "center",
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    marginTop: 16,
    fontSize: 12,
    color: "#9ca3af",
    letterSpacing: 0.3,
  },
})

/**
 * VariantToggle — animate={isOn ? 'on' : 'off'} with variants object.
 * Simulates a settings toggle switch. Tests variant string resolution.
 */
export const VariantToggle: StoryObj = {
  render: () => {
    const [isOn, setIsOn] = useState(false)

    const trackVariants = {
      on: { backgroundColor: "#22c55e" },
      off: { backgroundColor: "#e5e7eb" },
    }

    const thumbVariants = {
      on: { x: 26 },
      off: { x: 0 },
    }

    return (
      <View style={{ alignItems: "center" }}>
        <Pressable onPress={() => setIsOn((v) => !v)}>
          <Motion.View
            variants={trackVariants}
            animate={isOn ? "on" : "off"}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={styles.toggleTrack}
          >
            <Motion.View
              variants={thumbVariants}
              animate={isOn ? "on" : "off"}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              style={styles.toggleThumb}
            />
          </Motion.View>
        </Pressable>
        <Text style={styles.label}>{isOn ? "ON — tap to toggle" : "OFF — tap to toggle"}</Text>
      </View>
    )
  },
}
