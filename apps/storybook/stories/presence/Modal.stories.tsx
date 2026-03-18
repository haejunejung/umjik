import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { View, Text, Pressable, StyleSheet } from "react-native"
import { Motion } from "../../../../packages/src/core/Motion"
import { AnimatePresence } from "../../../../packages/src/presence/AnimatePresence"

const meta: Meta = {
  title: "Presence/Modal",
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
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000000",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  sheetBody: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginBottom: 24,
  },
  sheetButton: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  sheetButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 15,
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
 * Modal — backdrop dims + sheet slides up simultaneously.
 * Two Motion components animate in the same AnimatePresence pass.
 */
export const Modal: StoryObj = {
  render: () => {
    const [showModal, setShowModal] = useState(false)

    return (
      <View style={styles.screen}>
        <View style={styles.center}>
          <Pressable style={styles.primaryButton} onPress={() => setShowModal(true)}>
            <Text style={styles.primaryButtonText}>Open bottom sheet</Text>
          </Pressable>
          <Text style={styles.label}>Backdrop + sheet animate simultaneously</Text>
        </View>

        <AnimatePresence>
          {showModal && (
            <>
              <Motion.View
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={styles.backdrop}
              />
              <Motion.View
                key="sheet"
                initial={{ y: 400 }}
                animate={{ y: 0 }}
                exit={{ y: 400 }}
                transition={{ type: "spring", damping: 28, stiffness: 280 }}
                style={styles.sheet}
              >
                <View style={styles.sheetHandle} />
                <Text style={styles.sheetTitle}>Delete account?</Text>
                <Text style={styles.sheetBody}>
                  This action is permanent and cannot be undone. All your data will be removed
                  within 30 days.
                </Text>
                <Pressable
                  style={[styles.sheetButton, { backgroundColor: "#ef4444", marginBottom: 10 }]}
                  onPress={() => setShowModal(false)}
                >
                  <Text style={styles.sheetButtonText}>Yes, delete my account</Text>
                </Pressable>
                <Pressable
                  style={[styles.sheetButton, { backgroundColor: "#f3f4f6" }]}
                  onPress={() => setShowModal(false)}
                >
                  <Text style={[styles.sheetButtonText, { color: "#374151" }]}>Cancel</Text>
                </Pressable>
              </Motion.View>
            </>
          )}
        </AnimatePresence>
      </View>
    )
  },
}
