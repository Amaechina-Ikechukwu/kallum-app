import {
  View,
  Text,
  Animated,
  StyleSheet,
  Easing,
  Dimensions,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { HelloWave } from "@/components/HelloWave";
import KallumInput from "@/constants/KallumInput";
import { KallumButton } from "@/constants/KallumButton";
import kallumStore from "@/hooks/kallumstore";
import { useShallow } from "zustand/react/shallow";
import { ThemedText } from "@/components/ThemedText";
import { Link, router } from "expo-router";
import { accent } from "@/constants/Colors";
import { AuthPost } from "@/apis/Authentication/AuthPost";
import { useNotification } from "@/context/InAppNotificationContext";
import { useSession } from "@/context/AuthContext";

const { width, height } = Dimensions.get("window");
export default function Index() {
  const [inputValues, setInputValue] = useState({
    userName: "",

    passWord: "",
  });
  const { userName, passWord } = inputValues;
  const [setActionStatus, setRetryFunction] = kallumStore(
    useShallow((state: any) => [state.setActionStatus, state.setRetryFunction])
  );

  const { showNotification } = useNotification();
  const { session, isLoading, signIn } = useSession();

  const handleChange = (name: string, value: any) => {
    setInputValue((prevValues: any) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const body = { userName: userName.trim(), passWord };
  const validateInputs = () => {
    if (!userName || !passWord) {
      setActionStatus("failed");
      showNotification("All fields are required.");
      return false;
    }

    return true;
  };

  const setUpAccount = async () => {
    try {
      if (validateInputs()) {
        // Proceed with signup logic
        setActionStatus("loading");
        const result = await AuthPost("login", body);
        setActionStatus("done");
        signIn(result.token);
        showNotification("Congratulations, Kallum is here to serve");
        setActionStatus(null);
        router.push("/(tabs)");
      }
    } catch (error) {
      setRetryFunction(setUpAccount);
      setActionStatus("failed");
      showNotification(
        "Could not set up account at the moment. \n Please ensure your password contains a number and a character"
      );
    }
  };

  const position1 = useRef(new Animated.Value(0)).current;
  const position2 = useRef(new Animated.Value(0)).current;

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
              <KallumInput
                label="Enter full name"
                value={userName}
                setValue={(text) => handleChange("userName", text)}
                keyboardType="name-phone-pad"
              />
              <KallumInput
                label="Password"
                value={passWord}
                setValue={(text) => handleChange("passWord", text)}
                secureTextEntry
              />

              <KallumButton
                text="Log in to your account"
                onPress={setUpAccount}
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
