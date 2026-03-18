import { View, Text, Image, ScrollView } from "react-native"
import { createMotionComponent } from "./createMotionComponent"

export const Motion = {
  View: createMotionComponent(View),
  Text: createMotionComponent(Text),
  Image: createMotionComponent(Image),
  ScrollView: createMotionComponent(ScrollView),
  create: createMotionComponent,
}
