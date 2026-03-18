import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { View, Text, Pressable, StyleSheet } from "react-native"
import { Motion } from "../../../../packages/src/core/Motion"

const meta: Meta = {
  title: "Animation/SpringScale",
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
  box: {
    width: 100,
    height: 100,
    backgroundColor: "#6366f1",
    borderRadius: 16,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
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
 * SpringScale — custom spring parameters.
 * Tests that stiffness/damping values produce the expected springy feel.
 * Simulates a like button pop.
 */
export const SpringScale: StoryObj = {
  render: () => {
    const [liked, setLiked] = useState(false)
    return (
      <View style={{ alignItems: "center" }}>
        <Motion.View
          animate={{ scale: liked ? 1.25 : 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          style={[styles.box, { justifyContent: "center", alignItems: "center" }]}
        >
          <Text style={{ fontSize: 36 }}>{liked ? "❤️" : "🤍"}</Text>
        </Motion.View>
        <Pressable style={styles.button} onPress={() => setLiked((v) => !v)}>
          <Text style={styles.buttonText}>{liked ? "Unlike" : "Like"}</Text>
        </Pressable>
        <Text style={styles.label}>spring · stiffness 400 · damping 10</Text>
      </View>
    )
  },
}
