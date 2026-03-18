import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { View, Text, Pressable, StyleSheet } from "react-native"
import { Motion } from "../../../../packages/src/core/Motion"

const meta: Meta = {
  title: "Animation/NoInitial",
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
  card: {
    width: 240,
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
  },
  cardBody: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 18,
  },
  button: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#6366f1",
    borderRadius: 10,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  label: {
    marginTop: 12,
    fontSize: 12,
    color: "#9ca3af",
    letterSpacing: 0.3,
    textAlign: "center",
  },
})

/**
 * NoInitial — initial={false} skips the mount animation entirely.
 * Verifies that the component renders at its animate state immediately,
 * which is essential when restoring persisted UI without re-animating.
 */
export const NoInitial: StoryObj = {
  render: () => {
    const [key, setKey] = useState(0)
    return (
      <View style={{ alignItems: "center" }}>
        <Motion.View
          key={key}
          initial={false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={styles.card}
        >
          <Text style={styles.cardTitle}>No mount animation</Text>
          <Text style={styles.cardBody}>
            This card renders instantly at full opacity — no fade-in on mount.
          </Text>
        </Motion.View>
        <Pressable style={styles.button} onPress={() => setKey((k) => k + 1)}>
          <Text style={styles.buttonText}>Remount</Text>
        </Pressable>
        <Text style={styles.label}>initial={"{false}"} — renders at animate state immediately</Text>
      </View>
    )
  },
}
