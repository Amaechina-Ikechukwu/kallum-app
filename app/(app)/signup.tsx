import { View, Text } from "react-native";
import React from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import KallumInput from "@/constants/KallumInput";
import { KallumButton } from "@/constants/KallumButton";

export default function signup() {
  return (
    <ThemedView style={{ flex: 1, height: "100%" }}>
      <ThemedView style={{ justifyContent: "flex-start" }}>
        <ThemedText style={{ fontSize: 62, lineHeight: 70 }}>
          Secure, Safe, Here to stay.
        </ThemedText>
      </ThemedView>

      <ThemedView style={{ gap: 20 }}>
        <KallumInput label="Full Name" />
        <KallumInput label="Email Address" />
        <KallumInput label="Phone Number" />
        <KallumInput label="Password" />
        <KallumInput label="Confirm Password" />
      </ThemedView>

      <KallumButton text="Set up account on Kallum" />
    </ThemedView>
  );
}
