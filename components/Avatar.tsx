import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { accent } from "@/constants/Colors";

export default function Avatar({ name }: { name: string }) {
  return (
    <ThemedView style={styles.diamond}>
      <ThemedText type="subtitle" style={[styles.textView, { fontSize: 40 }]}>
        {name[0].toUpperCase()}
      </ThemedText>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  diamond: {
    width: 80,
    height: 80,
    // backgroundColor: "blue",
    borderWidth: 1,
    borderColor: accent,
    transform: [{ rotate: "45deg" }],
    marginVertical: 20,
  },
  textView: {
    transform: [{ rotate: "-45deg" }],
  },
});
