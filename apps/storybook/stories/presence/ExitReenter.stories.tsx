import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { View, Text, Pressable, StyleSheet } from "react-native"
import { Motion } from "../../../../packages/src/core/Motion"
import { AnimatePresence } from "../../../../packages/src/presence/AnimatePresence"

const meta: Meta = {
  title: "Presence/ExitReenter",
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
  secondaryButton: {
    paddingHorizontal: 20,
    paddingVertical: 11,
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    alignItems: "center",
  },
  primaryButton: {
    paddingHorizontal: 20,
    paddingVertical: 11,
    backgroundColor: "#6366f1",
    borderRadius: 10,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 14,
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
 * ExitReenter — same key exits then re-enters before exit completes.
 * Tests that AnimatePresence correctly cancels in-progress exit and
 * restores the "entering" state for the same key.
 */
export const ExitReenter: StoryObj = {
  render: () => {
    const [show, setShow] = useState(true)
    const [phase, setPhase] = useState<"shown" | "hidden">("shown")

    const hide = () => {
      setShow(false)
      setPhase("hidden")
    }

    const reenter = () => {
      setShow(true)
      setPhase("shown")
    }

    const hideAndQuickReenter = () => {
      setShow(false)
      // Re-enter while exit animation is still running (~200ms window)
      setTimeout(() => setShow(true), 120)
      setPhase("shown")
    }

    return (
      <View style={styles.container}>
        <View style={{ height: 130, justifyContent: "center", alignItems: "center" }}>
          <AnimatePresence>
            {show && (
              <Motion.View
                key="reenter-target"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ type: "spring", stiffness: 80, damping: 18 }}
                style={{
                  width: 200,
                  padding: 16,
                  backgroundColor: "#ffffff",
                  borderRadius: 14,
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: "600", color: "#374151" }}>
                  {phase === "shown" ? "I'm here!" : "Coming back..."}
                </Text>
              </Motion.View>
            )}
          </AnimatePresence>
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pressable style={styles.secondaryButton} onPress={show ? hide : reenter}>
            <Text style={styles.secondaryButtonText}>{show ? "Hide" : "Show"}</Text>
          </Pressable>
          <Pressable style={styles.primaryButton} onPress={hideAndQuickReenter}>
            <Text style={styles.primaryButtonText}>Hide → Reenter (120ms)</Text>
          </Pressable>
        </View>
        <Text style={styles.label}>"Hide → Reenter" re-enters before exit completes</Text>
      </View>
    )
  },
}
