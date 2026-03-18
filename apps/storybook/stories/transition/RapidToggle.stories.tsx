import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { View, Text, Pressable, StyleSheet } from "react-native"
import { Motion } from "../../../../packages/src/core/Motion"
import { AnimatePresence } from "../../../../packages/src/presence/AnimatePresence"

const meta: Meta = {
  title: "Transition/RapidToggle",
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
    padding: 24,
    backgroundColor: "#f9fafb",
    minHeight: 300,
  },
  primaryButton: {
    paddingHorizontal: 20,
    paddingVertical: 11,
    backgroundColor: "#6366f1",
    borderRadius: 10,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  label: {
    marginTop: 12,
    fontSize: 11,
    color: "#9ca3af",
    letterSpacing: 0.3,
    textAlign: "center",
  },
})

/**
 * RapidToggle — toggles faster than the animation duration.
 * Verifies that mid-flight interruptions don't cause visual glitches or
 * stuck states. Tap the button repeatedly before animations settle.
 */
export const RapidToggle: StoryObj = {
  render: () => {
    const [show, setShow] = useState(true)
    const [tapCount, setTapCount] = useState(0)

    const toggle = () => {
      setShow((v) => !v)
      setTapCount((n) => n + 1)
    }

    return (
      <View style={styles.container}>
        <View style={{ height: 120, justifyContent: "center", alignItems: "center" }}>
          <AnimatePresence>
            {show && (
              <Motion.View
                key="rapid"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 45,
                  backgroundColor: "#6366f1",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>{tapCount}</Text>
              </Motion.View>
            )}
          </AnimatePresence>
        </View>

        <Pressable style={styles.primaryButton} onPress={toggle}>
          <Text style={styles.primaryButtonText}>Toggle rapidly</Text>
        </Pressable>
        <Text style={styles.label}>Tap fast before animation settles · count: {tapCount}</Text>
      </View>
    )
  },
}
