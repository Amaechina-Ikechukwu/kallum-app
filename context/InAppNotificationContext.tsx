import React, {
  createContext,
  useMemo,
  useRef,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import kallumStore from "@/hooks/kallumstore";
import { shallow } from "zustand/shallow";
import { Colors, accent } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { AntDesign } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { KallumButton } from "@/constants/KallumButton";
import { useShallow } from "zustand/react/shallow";

// Create the context with a proper type
const InAppNotificationContext = createContext<{
  showNotification: (message: string) => void;
} | null>(null);

interface NotificationResponse {
  text?: string;
  actionStatus: string | null;
  retryFunction: (() => void) | null;
}

const Notifications = ({
  text,
  actionStatus,
  retryFunction,
}: NotificationResponse) => {
  const theme = useColorScheme() ?? "light";

  if (actionStatus === "loading") {
    return (
      <ThemedView style={{ gap: 40, flex: 1 }}>
        <ActivityIndicator color={accent} size={"large"} />
      </ThemedView>
    );
  }
  if (actionStatus === "done") {
    return (
      <ThemedView style={{ gap: 40, flex: 1 }}>
        <AntDesign name="checkcircleo" size={40} color={Colors[theme].text} />
        <ThemedText>{text || "Completed"}</ThemedText>
      </ThemedView>
    );
  }
  if (actionStatus === "failed") {
    return (
      <ThemedView style={{ gap: 40, flex: 1 }}>
        <Ionicons name="sad-outline" size={40} color={Colors[theme].text} />
        <ThemedText>{text || "Something went wrong"}</ThemedText>
        <KallumButton text={"Retry"} onPress={retryFunction || (() => {})} />
      </ThemedView>
    );
  }
  return null;
};

export default function InAppNotificationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [notificationText, setNotificationText] = useState("");
  const [actionStatus, setActionStatus, retryFunction, setRetryFunction] =
    kallumStore(
      useShallow((state) => [
        state.actionStatus,
        state.setActionStatus,
        state.retryFunction,
        state.setRetryFunction,
      ])
    );
  const snapPoints = useMemo(() => ["25%"], []);

  const showNotification = (message: string) => {
    setNotificationText(message);
    bottomSheetRef.current?.snapToIndex(0);
  };

  const handleClose = () => {
    setActionStatus(null);
  };

  const handleSheetChanges = (index: number) => {
    if (index === -1) {
      handleClose();
    }
  };

  const retryFFunction = () => {
    if (retryFunction !== null && typeof retryFunction === "function") {
      retryFunction();
      setNotificationText("");
      handleClose();
    } else {
      handleClose();
      setNotificationText("");
    }
  };

  useEffect(() => {
    if (actionStatus !== null) {
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [actionStatus]);

  return (
    <InAppNotificationContext.Provider value={{ showNotification }}>
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
              retryFunction={retryFFunction}
              text={notificationText}
              actionStatus={actionStatus}
            />
          </BottomSheetView>
        </BottomSheet>
      )}
    </InAppNotificationContext.Provider>
  );
}

export const useNotification = () => {
  const context = useContext(InAppNotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within an InAppNotificationProvider"
    );
  }
  return context;
};

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
