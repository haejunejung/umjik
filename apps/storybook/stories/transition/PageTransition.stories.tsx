import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { View, Text, Pressable, StyleSheet } from "react-native"
import { Motion } from "../../../../packages/src/core/Motion"
import { AnimatePresence } from "../../../../packages/src/presence/AnimatePresence"

const meta: Meta = {
  title: "Transition/PageTransition",
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
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pageCard: {
    width: 280,
    padding: 28,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  pageEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
  },
  pageDots: {
    flexDirection: "row",
    gap: 6,
    marginTop: 24,
  },
  pageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#e5e7eb",
  },
  listActions: {
    flexDirection: "row",
    gap: 8,
    padding: 16,
    paddingTop: 8,
  },
  primaryButton: {
    paddingHorizontal: 20,
    paddingVertical: 11,
    backgroundColor: "#6366f1",
    borderRadius: 10,
    alignItems: "center",
  },
  secondaryButton: {
    paddingHorizontal: 20,
    paddingVertical: 11,
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  secondaryButtonText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 14,
  },
  label: {
    marginTop: 12,
    fontSize: 11,
    color: "#9ca3af",
    letterSpacing: 0.3,
    textAlign: "center",
    paddingBottom: 16,
  },
})

const PAGES = [
  { id: "welcome", emoji: "👋", title: "Welcome", subtitle: "Great to have you here" },
  {
    id: "features",
    emoji: "✨",
    title: "Powerful features",
    subtitle: "Everything you need in one place",
  },
  {
    id: "ready",
    emoji: "🚀",
    title: "You're all set",
    subtitle: "Let's get started on something great",
  },
]

/**
 * PageTransition — mode="wait" ensures previous page exits before next enters.
 * Classic onboarding flow pattern.
 */
export const PageTransition: StoryObj = {
  render: () => {
    const [pageIndex, setPageIndex] = useState(0)
    const page = PAGES[pageIndex]

    return (
      <View style={styles.screen}>
        <View style={styles.page}>
          <AnimatePresence mode="wait">
            <Motion.View
              key={page.id}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ type: "spring", damping: 24, stiffness: 220 }}
              style={styles.pageCard}
            >
              <Text style={styles.pageEmoji}>{page.emoji}</Text>
              <Text style={styles.pageTitle}>{page.title}</Text>
              <Text style={styles.pageSubtitle}>{page.subtitle}</Text>
            </Motion.View>
          </AnimatePresence>

          <View style={styles.pageDots}>
            {PAGES.map((p, i) => (
              <Motion.View
                key={p.id}
                animate={{
                  backgroundColor: i === pageIndex ? "#6366f1" : "#e5e7eb",
                  width: i === pageIndex ? 18 : 6,
                }}
                transition={{ type: "spring", damping: 20 }}
                style={[styles.pageDot]}
              />
            ))}
          </View>
        </View>

        <View style={styles.listActions}>
          <Pressable
            style={[styles.secondaryButton, pageIndex === 0 && { opacity: 0.4 }]}
            onPress={() => setPageIndex((i) => Math.max(0, i - 1))}
          >
            <Text style={styles.secondaryButtonText}>← Back</Text>
          </Pressable>
          <Pressable
            style={[styles.primaryButton, pageIndex === PAGES.length - 1 && { opacity: 0.4 }]}
            onPress={() => setPageIndex((i) => Math.min(PAGES.length - 1, i + 1))}
          >
            <Text style={styles.primaryButtonText}>Next →</Text>
          </Pressable>
        </View>
        <Text style={styles.label}>mode="wait" — previous page fully exits before next enters</Text>
      </View>
    )
  },
}
