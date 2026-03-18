import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { View, Text, Pressable, StyleSheet } from "react-native"
import { Motion } from "../../../../packages/src/core/Motion"
import { AnimatePresence } from "../../../../packages/src/presence/AnimatePresence"

const meta: Meta = {
  title: "Layout/CardList",
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
  listContainer: {
    flex: 1,
    padding: 16,
  },
  listCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  listCardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  listCardName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  listCardMeta: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  listCardRemove: {
    marginLeft: "auto" as any,
    padding: 4,
  },
  listCardRemoveText: {
    fontSize: 16,
    color: "#d1d5db",
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
  },
})

interface Contact {
  id: number
  name: string
  role: string
  color: string
  emoji: string
}

const INITIAL_CONTACTS: Contact[] = [
  { id: 1, name: "Alice Kim", role: "Product Designer", color: "#6366f1", emoji: "👩‍🎨" },
  { id: 2, name: "Bob Chen", role: "Frontend Engineer", color: "#f59e0b", emoji: "👨‍💻" },
  { id: 3, name: "Carol Park", role: "Engineering Manager", color: "#10b981", emoji: "👩‍💼" },
]

let nextId = 4

const NEW_CONTACTS: Omit<Contact, "id">[] = [
  { name: "David Lee", role: "Backend Engineer", color: "#f43f5e", emoji: "🧑‍💻" },
  { name: "Emma Tan", role: "Data Scientist", color: "#8b5cf6", emoji: "👩‍🔬" },
  { name: "Frank Wu", role: "DevOps Engineer", color: "#0ea5e9", emoji: "🧑‍🔧" },
]

/**
 * CardList — items enter/exit with natural animations.
 * Tests AnimatePresence managing multiple simultaneous children.
 */
export const CardList: StoryObj = {
  render: () => {
    const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS)
    const [newIndex, setNewIndex] = useState(0)

    const addContact = () => {
      const template = NEW_CONTACTS[newIndex % NEW_CONTACTS.length]
      setContacts((prev) => [...prev, { ...template, id: nextId++ }])
      setNewIndex((i) => i + 1)
    }

    const removeContact = (id: number) => {
      setContacts((prev) => prev.filter((c) => c.id !== id))
    }

    return (
      <View style={styles.screen}>
        <View style={styles.listContainer}>
          <AnimatePresence>
            {contacts.map((contact) => (
              <Motion.View
                key={contact.id}
                initial={{ opacity: 0, x: -24, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 68 }}
                exit={{ opacity: 0, x: 24, height: 0 }}
                transition={{ type: "spring", damping: 22, stiffness: 260 }}
                style={styles.listCard}
              >
                <View style={[styles.listCardAvatar, { backgroundColor: contact.color + "20" }]}>
                  <Text style={{ fontSize: 20 }}>{contact.emoji}</Text>
                </View>
                <View>
                  <Text style={styles.listCardName}>{contact.name}</Text>
                  <Text style={styles.listCardMeta}>{contact.role}</Text>
                </View>
                <Pressable style={styles.listCardRemove} onPress={() => removeContact(contact.id)}>
                  <Text style={styles.listCardRemoveText}>✕</Text>
                </Pressable>
              </Motion.View>
            ))}
          </AnimatePresence>
        </View>

        <View style={styles.listActions}>
          <Pressable style={styles.primaryButton} onPress={addContact}>
            <Text style={styles.primaryButtonText}>Add contact</Text>
          </Pressable>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => contacts.length > 0 && removeContact(contacts[contacts.length - 1].id)}
          >
            <Text style={styles.secondaryButtonText}>Remove last</Text>
          </Pressable>
        </View>
        <Text style={[styles.label, { paddingBottom: 12 }]}>
          Tap ✕ on a card or use the buttons
        </Text>
      </View>
    )
  },
}
