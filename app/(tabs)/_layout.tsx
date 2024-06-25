import { Redirect, Tabs, router } from "expo-router";
import React, { useEffect, useState } from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors, accent } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useSession } from "@/context/AuthContext";
import kallumStore from "@/hooks/kallumstore";
import { useShallow } from "zustand/react/shallow";
import { AuthPost } from "@/apis/Authentication/AuthPost";
import { AuthGet } from "@/apis/Authentication/AuthGet";
import { AppState } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [setKallumLockStatus, kallumLockStatus, setIsSecured, isSecured] =
    kallumStore(
      useShallow((state) => [
        state.setKallumLockStatus,
        state.kallumLockStatus,
        state.setIsSecured,
        state.isSecured,
      ])
    );
  const { session, isLoading } = useSession();
  const checkKallumLockStatus = async () => {
    const result = await AuthGet("kallumlock", session);
    setKallumLockStatus(result);
  };
  useEffect(() => {
    if (session) {
      // router.push("/(app)/pinsetup");
      checkKallumLockStatus();
    }
  }, [session]);
  useEffect(() => {
    if (session && kallumLockStatus) {
      if (
        kallumLockStatus?.securePin == null ||
        kallumLockStatus?.securePin.length == 0
      ) {
        router.push("/(app)/pinsetup");
        return;
      }
      if (
        kallumLockStatus?.transactionPin == null ||
        kallumLockStatus?.transactionPin.length == 0
      ) {
        router.push("/(app)/transactionpinsetup");
        return;
      }
    }
  }, [kallumLockStatus]);
  useEffect(() => {
    if (isSecured !== null && session !== null) {
      if (!isSecured) {
        router.push("/(app)/pinsecure");
        return;
      }
    }
  }, [isSecured, session]);
  const [appState, setAppState] = useState(AppState.currentState);
  const [message, setMessage] = useState("App is active");
  useEffect(() => {
    const handleAppStateChange = (nextAppState: any) => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        if (isSecured == false) {
          router.push("/(app)/pinsecure");
        }
      } else if (nextAppState.match(/inactive|background/)) {
        if (session !== null) {
          if (kallumLockStatus?.securePin !== null) {
            setIsSecured(false);
          }
        }
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    // Cleanup the event listener
    return () => {
      subscription.remove();
    };
  }, [session, kallumLockStatus, isSecured]);

  if (!session) {
    return <Redirect href={"/(app)/signin"} />;
  }
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: accent,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "cash" : "cash-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "code-slash" : "code-slash-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
