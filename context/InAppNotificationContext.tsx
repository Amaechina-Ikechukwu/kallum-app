import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import React, {
  createContext,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import kallumStore from "@/hooks/kallumstore";
import { useShallow } from "zustand/react/shallow";
import { Colors, accent } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { AntDesign } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { KallumButton } from "@/constants/KallumButton";

const InAppNotification: any = createContext(null);

interface NotificationResponse {
  text?: string;
  actionStatus: string | null;
}

const Notifications = ({ text, actionStatus }: NotificationResponse) => {
  const theme = useColorScheme() ?? "light";

  if (actionStatus == "loading") {
    return (
      <ThemedView style={{ gap: 40, flex: 1 }}>
        <ActivityIndicator color={accent} size={"large"} />
      </ThemedView>
    );
  }
  if (actionStatus == "done") {
    return (
      <ThemedView style={{ gap: 40, flex: 1 }}>
        <AntDesign name="checkcircleo" size={40} color={Colors[theme].text} />
        <ThemedText>{text || "Completed"}</ThemedText>
      </ThemedView>
    );
  }
  if (actionStatus == "failed") {
    return (
      <ThemedView style={{ gap: 40, flex: 1 }}>
        <Ionicons name="sad-outline" size={40} color={Colors[theme].text} />
        <ThemedText>{text || "Something went wrong"}</ThemedText>
        <KallumButton text={"Retry"} />
      </ThemedView>
    );
  }
  return null; // Ensuring a proper return type
};

export default function InAppNotificationContext({ children }: any) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [notificationText, setNotificationText] = useState("");
  const [actionStatus, setActionStatus] = kallumStore(
    useShallow((state: any) => [state.actionStatus, state.setActionStatus])
  );
  const snapPoints = useMemo(() => ["25%"], []);

  const showNotification = (message: string) => {
    setNotificationText(message);
    // Open the bottom sheet
    bottomSheetRef.current?.snapToIndex(0);
  };
  const handleClose = () => {
    setActionStatus(null);
    return;
  };
  const handleSheetChanges = (index: number) => {
    console.log("closing");
    if (index === -1) {
      handleClose();
    }
  };
  useEffect(() => {
    console.log(actionStatus);
    if (actionStatus !== null) {
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [actionStatus, bottomSheetRef]);

  return (
    <InAppNotification.Provider value={{ showNotification }}>
      {children}
      {actionStatus !== null && (
        <BottomSheet
          ref={bottomSheetRef}
          index={actionStatus !== null ? 0 : -1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          onChange={handleSheetChanges}
        >
          <BottomSheetView style={styles.contentContainer}>
            <Notifications
              text={notificationText}
              actionStatus={actionStatus}
            />
          </BottomSheetView>
        </BottomSheet>
      )}
    </InAppNotification.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});
