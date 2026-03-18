import { View, Text } from "react-native"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta = {
  title: "Test/Hello",
}

export default meta

export const Hello: StoryObj = {
  render: () => (
    <View style={{ padding: 20 }}>
      <Text>Hello from Storybook!</Text>
    </View>
  ),
}
