import { Image, StyleSheet, Platform } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { KallumButton } from "@/constants/KallumButton";
import KallumInput from "@/constants/KallumInput";
import { useEffect, useState } from "react";
import kallumStore from "@/hooks/kallumstore";
import { useShallow } from "zustand/react/shallow";
import { BankGet } from "@/apis/Bank/BankGet";
import { useSession } from "@/context/AuthContext";
import BankDetails from "@/components/UserInterfacees/HomePPage/BankDetails";

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useSession();
  const [setAccountDetails, setBalanceDetails] = kallumStore(
    useShallow((state) => [state.setAccountDetails, state.setBalanceDetails])
  );
  const getBankDetails = async () => {
    const result = await BankGet("accountdetails", session);
    const balance = await BankGet("balance", session);

    setAccountDetails(result);
    setBalanceDetails(balance);
    setIsLoading(true);
  };
  useEffect(() => {
    getBankDetails();
  }, []);
  if (!isLoading) {
    return (
      <ThemedView style={{ flex: 1, height: "100%" }}>
        <HelloWave />
      </ThemedView>
    );
  }
  return (
    <ThemedView>
      <BankDetails />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
