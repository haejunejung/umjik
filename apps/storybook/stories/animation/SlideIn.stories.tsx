import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { View, Text, Pressable, StyleSheet } from "react-native"
import { Motion } from "../../../../packages/src/core/Motion"

const meta: Meta = {
  title: "Animation/SlideIn",
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
  },
})

/**
 * SlideIn — initial.x → animate.x = 0.
 * Verifies transform property conversion (x → translateX) and spring defaults.
 * Simulates a notification sliding in from the left.
 */
export const SlideIn: StoryObj = {
  render: () => {
    const [key, setKey] = useState(0)
    return (
      <View style={{ alignItems: "center" }}>
        <Motion.View
          key={key}
          initial={{ x: -160, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          style={styles.card}
        >
          <Text style={styles.cardTitle}>New message</Text>
          <Text style={styles.cardBody}>Sarah replied to your comment.</Text>
        </Motion.View>
        <Pressable style={styles.button} onPress={() => setKey((k) => k + 1)}>
          <Text style={styles.buttonText}>Replay</Text>
        </Pressable>
        <Text style={styles.label}>Slides from left · spring stiffness 120</Text>
      </View>
    )
  },
}
