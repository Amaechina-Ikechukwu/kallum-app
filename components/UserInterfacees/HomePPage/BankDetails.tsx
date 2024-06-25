import { View, Text, StyleSheet } from "react-native";
import React from "react";
import kallumStore from "@/hooks/kallumstore";
import { useShallow } from "zustand/react/shallow";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import Avatar from "@/components/Avatar";

export default function BankDetails() {
  const [accountDetails, balanceDetails] = kallumStore(
    useShallow((state) => [state.accountDetails, state.balanceDetails])
  );
  const date = `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`;
  function formatMoney(amount: any, locale = "en-US", currency = "USD") {
    return amount?.toLocaleString(locale, {
      style: "currency",
      currency: currency,
    });
  }
  return (
    <ThemedView style={styles.detailsContainer}>
      <ThemedView style={styles.nameContainer}>
        <Avatar name={accountDetails?.kallumUser?.userName} />
        <ThemedText>{accountDetails?.kallumUser?.userName}</ThemedText>
      </ThemedView>
      <ThemedText type="title">
        {formatMoney(balanceDetails?.currentBalance, "en-NG", "NGN")}
      </ThemedText>
      <ThemedView style={styles.accountContainer}>
        <ThemedText type="subtitle">{accountDetails?.bankAccountId}</ThemedText>
        <ThemedText type="default" style={{ fontSize: 8 }}>
          Tap to copy
        </ThemedText>
      </ThemedView>

      <ThemedText type="default">{date} . Today</ThemedText>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  nameContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    width: "auto",
  },
  detailsContainer: {
    alignItems: "flex-start",
    gap: 10,
  },
  accountContainer: {
    alignItems: "flex-end",
    justifyContent: "flex-start",
    flexDirection: "row",
    width: "auto",
    padding: 0,
  },
});
