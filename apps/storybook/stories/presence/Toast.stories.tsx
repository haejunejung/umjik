import { useState, useCallback } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { View, Text, Pressable, StyleSheet } from "react-native"
import { Motion } from "../../../../packages/src/core/Motion"
import { AnimatePresence } from "../../../../packages/src/presence/AnimatePresence"

const meta: Meta = {
  title: "Presence/Toast",
  decorators: [
    (Story) => (
      <View style={styles.screen}>
        <Story />
      </View>
    ),
  ],
}

export default meta

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f9fafb",
    minHeight: 500,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  toastContainer: {
    position: "absolute",
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: "#111827",
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    gap: 8,
  },
  toastText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
  toastIcon: {
    fontSize: 16,
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
 * Toast — slides up from bottom, auto-dismisses after 3 seconds.
 * Most common AnimatePresence + exit use case.
 */
export const Toast: StoryObj = {
  render: () => {
    const [showToast, setShowToast] = useState(false)

    const trigger = useCallback(() => {
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }, [])

    return (
      <View style={styles.screen}>
        <View style={styles.center}>
          <Pressable style={styles.primaryButton} onPress={trigger}>
            <Text style={styles.primaryButtonText}>Save changes</Text>
          </Pressable>
          <Text style={styles.label}>Tap to trigger · auto-dismisses after 3s</Text>
        </View>

        <View style={styles.toastContainer} pointerEvents="none">
          <AnimatePresence>
            {showToast && (
              <Motion.View
                key="toast"
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 80, opacity: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 260 }}
                style={styles.toast}
              >
                <Text style={styles.toastIcon}>✅</Text>
                <Text style={styles.toastText}>Changes saved successfully</Text>
              </Motion.View>
            )}
          </AnimatePresence>
        </View>
      </View>
    )
  },
}
