import { View, Text, Image, StyleSheet } from "react-native";
import React, { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import KallumInput from "@/constants/KallumInput";
import { KallumButton } from "@/constants/KallumButton";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import { AuthPost } from "@/apis/Authentication/AuthPost";
import kallumStore from "@/hooks/kallumstore";
import { router } from "expo-router";
import { useNotification } from "@/context/InAppNotificationContext";
import { useSession } from "@/context/AuthContext";
import { useShallow } from "zustand/react/shallow";

export default function Signup() {
  const [inputValues, setInputValue] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    passWord: "",
    confirmPassword: "",
  });
  const { fullName, email, phoneNumber, passWord, confirmPassword } =
    inputValues;
  const [setActionStatus] = kallumStore(
    useShallow((state: any) => [state.setActionStatus])
  );

  const { showNotification } = useNotification();
  const { session, isLoading, signIn } = useSession();

  const handleChange = (name: string, value: any) => {
    setInputValue((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const body = { fullName: fullName.trim(), email, phoneNumber, passWord };
  const validateInputs = () => {
    if (!fullName || !email || !phoneNumber || !passWord || !confirmPassword) {
      setActionStatus("failed");
      showNotification("All fields are required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setActionStatus("failed");
      showNotification("Please enter a valid email address.");
      return false;
    }
    if (passWord !== confirmPassword) {
      setActionStatus("failed");
      showNotification("Passwords do not match.");
      return false;
    }
    return true;
  };

  const setUpAccount = async () => {
    try {
      if (validateInputs()) {
        // Proceed with signup logic
        setActionStatus("loading");
        const result = await AuthPost("register", body);
        setActionStatus("done");
        signIn(result.token);
        showNotification("Congratulations, Kallum is here to serve");
        router.push("/(tabs)");
      }
    } catch (error) {
      console.log(error);
      setActionStatus("failed");
      showNotification(
        "Could not set up account at the moment. \n Please ensure your password contains a number and a character"
      );
    }
  };

  return (
    <ThemedView style={{ flex: 1, height: "100%" }}>
      <ThemedView style={{ justifyContent: "flex-start" }}>
        <ThemedText style={{ fontSize: 62, lineHeight: 70 }}>
          Secure, Safe, Here to stay.
        </ThemedText>
      </ThemedView>

      <ThemedView style={{ gap: 20 }}>
        <KallumInput
          label="Full Name"
          value={inputValues.fullName}
          setValue={(text) => handleChange("fullName", text)}
          keyboardType="name-phone-pad"
        />
        <KallumInput
          label="Email Address"
          value={inputValues.email}
          setValue={(text) => handleChange("email", text)}
          keyboardType="email-address"
        />
        <KallumInput
          label="Phone Number"
          value={inputValues.phoneNumber}
          setValue={(text) => handleChange("phoneNumber", text)}
          keyboardType="number-pad"
        />
        <KallumInput
          label="Password"
          value={inputValues.passWord}
          setValue={(text) => handleChange("passWord", text)}
          secureTextEntry
        />
        <KallumInput
          label="Confirm Password"
          value={inputValues.confirmPassword}
          setValue={(text) => handleChange("confirmPassword", text)}
          secureTextEntry
        />
      </ThemedView>

      <KallumButton text="Set up account on Kallum" onPress={setUpAccount} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  image: {
    height: 100,
    width: 100,
  },
});
