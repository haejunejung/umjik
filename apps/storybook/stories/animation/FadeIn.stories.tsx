import type { Meta, StoryObj } from "@storybook/react"
import { View, Text, StyleSheet } from "react-native"
import { Motion } from "../../../../packages/src/core/Motion"

const meta: Meta = {
  title: "Animation/FadeIn",
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
  label: {
    marginTop: 12,
    fontSize: 12,
    color: "#9ca3af",
    letterSpacing: 0.3,
  },
})

/**
 * FadeIn — initial/animate with opacity.
 * Most fundamental animation test: verifies opacity tween runs on mount.
 */
export const FadeIn: StoryObj = {
  render: () => (
    <View style={{ alignItems: "center" }}>
      <Motion.View
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={styles.card}
      >
        <Text style={styles.cardTitle}>Welcome back</Text>
        <Text style={styles.cardBody}>
          Your dashboard is ready. Here's what happened while you were away.
        </Text>
      </Motion.View>
      <Text style={styles.label}>Fades in on mount · duration 0.6s</Text>
    </View>
  ),
}
