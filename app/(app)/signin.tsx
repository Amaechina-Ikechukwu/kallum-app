import {
  View,
  Text,
  Animated,
  StyleSheet,
  Easing,
  Dimensions,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { ThemedView } from "@/components/ThemedView";
import { HelloWave } from "@/components/HelloWave";
import KallumInput from "@/constants/KallumInput";
import { KallumButton } from "@/constants/KallumButton";
import kallumStore from "@/hooks/kallumstore";
import { useShallow } from "zustand/react/shallow";
import { ThemedText } from "@/components/ThemedText";
import { Link, router } from "expo-router";
import { accent } from "@/constants/Colors";

const { width, height } = Dimensions.get("window");
export default function Index() {
  const [setActionStatus] = kallumStore(
    useShallow((state) => [state.setActionStatus])
  );
  const position1 = useRef(new Animated.Value(0)).current;
  const position2 = useRef(new Animated.Value(0)).current;
  const handlePress = () => {
    router.push("/(app)/pinsecure");
    // setActionStatus("loading");
    // setTimeout(() => {
    //   setActionStatus("done");
    // }, 15000);
    // setTimeout(() => {
    //   setActionStatus("failed");
    // }, 16000);
  };
  useEffect(() => {
    // Define the animation
    Animated.timing(position1, {
      toValue: height / 2 - 600, // Adjust to move the first input upwards from the center
      duration: 1000,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
    Animated.timing(position2, {
      toValue: height / 2 - 400, // Adjust to move the second input downwards from the center
      duration: 1000,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, [position1, position2]);
  return (
    <>
      <ThemedView style={{ flex: 1 }}>
        <ThemedView>
          <Animated.View
            style={[
              styles.inputSection,
              { transform: [{ translateY: position1 }] },
            ]}
          >
            <HelloWave />
          </Animated.View>

          <Animated.View
            style={[
              styles.inputSection,
              { transform: [{ translateY: position2 }] },
            ]}
          >
            <ThemedView style={{ gap: 30 }}>
              <KallumInput label="Enter Username or email" />
              <KallumInput label="Password" />

              <KallumButton
                text="Log in to your account"
                onPress={handlePress}
              />
            </ThemedView>
          </Animated.View>
        </ThemedView>
      </ThemedView>
      <ThemedView style={{ flexDirection: "row", gap: 10 }}>
        <ThemedText>Yet to have an account on Kallum?</ThemedText>
        <Link href={"/(app)/signup"}>
          <ThemedText style={{ color: accent }}>Click to create</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}
const styles = StyleSheet.create({
  inputSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    position: "absolute",
  },
});
