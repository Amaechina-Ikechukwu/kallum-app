import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  useColorScheme,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { IconProps } from "@expo/vector-icons/build/createIconSet";
import { ThemedView } from "@/components/ThemedView";
import { Colors, accent } from "@/constants/Colors";
import kallumStore from "@/hooks/kallumstore";
import { useShallow } from "zustand/react/shallow";
import { useNotification } from "@/context/InAppNotificationContext";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { AuthPatch } from "@/apis/Authentication/AuthPatch";
import { useSession } from "@/context/AuthContext";
const { width, height } = Dimensions.get("window");

const CircleComponent = (props: {
  number: any;
  theme: any;
  handleInput: (value: string) => void;
}) => {
  const icons = {
    12: <Feather name="delete" size={24} color={Colors[props.theme].text} />,
    13: (
      <MaterialIcons name="clear" size={24} color={Colors[props.theme].text} />
    ),
  };
  if (props.number == 12) {
    return (
      <TouchableOpacity
        style={{
          borderRadius: 100,
          height: 70,
          width: 70,
          backgroundColor: Colors[props.theme].icon,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => props.handleInput(props.number)}
      >
        {icons[12]}
      </TouchableOpacity>
    );
  }
  if (props.number == 13) {
    return (
      <TouchableOpacity
        style={{
          borderRadius: 100,
          height: 70,
          width: 70,
          backgroundColor: Colors[props.theme].icon,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => props.handleInput(props.number)}
      >
        {icons[13]}
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity
      style={{
        borderRadius: 100,
        height: 70,
        width: 70,
        backgroundColor: Colors[props.theme].icon,
        alignItems: "center",
        justifyContent: "center",
      }}
      onPress={() => props.handleInput(props.number)}
    >
      <ThemedText>{props.number}</ThemedText>
    </TouchableOpacity>
  );
};

export default function TransactionPinSetup() {
  const [setActionStatus, setRetryFunction] = kallumStore(
    useShallow((state) => [state.setActionStatus, state.setRetryFunction])
  );
  const theme = useColorScheme() ?? "light";
  const [pin, setPin] = useState({
    firstPin: "",
    secondPin: "",
  });
  const { showNotification } = useNotification();
  const [secondStage, setSecondStage] = useState(Boolean);
  const { session } = useSession();
  const deleteSingle = () => {
    setPin((prevPin) => ({
      ...prevPin,
      [secondStage ? "secondPin" : "firstPin"]: prevPin[
        secondStage ? "secondPin" : "firstPin"
      ].substring(
        0,
        prevPin[secondStage ? "secondPin" : "firstPin"].length - 1
      ),
    }));
  };

  const deleteAll = () => {
    if (secondStage) {
      setPin((prevPin) => ({
        ...prevPin,
        secondPin: "",
      }));
    } else {
      setPin((prevPin) => ({
        ...prevPin,
        firstPin: "",
      }));
    }
  };
  const body = {
    securePin: "",
    transactionPin: pin.firstPin,
  };
  const setSecurePin = async () => {
    try {
      await AuthPatch("kallumlock", session, body);
      setActionStatus("done");
      showNotification("Pin has been set");

      router.push("/(tabs)/");
      setActionStatus(null);
    } catch (error) {
      throw error;
    }
  };

  const handleInput = (value: string | number | { name: string }) => {
    if (value == "12") {
      deleteSingle();
    } else if (value == "13") {
      deleteAll();
    } else {
      const stringValue = value.toString(); // Convert value to string if it's a number
      if (pin.firstPin.length <= 5) {
        if (pin.firstPin.length == 0 && stringValue == "0") {
          showNotification("Do not start pin with 0");
          setActionStatus("failed");
        } else {
          setPin((prevPin) => ({
            ...prevPin,
            firstPin: prevPin.firstPin + stringValue,
          }));
        }
      } else {
        if (pin.secondPin.length <= 5) {
          if (pin.secondPin.length == 0 && stringValue == "0") {
            showNotification("Do not start pin with 0");
            setActionStatus("failed");
          } else {
            setPin((prevPin) => ({
              ...prevPin,
              secondPin: prevPin.secondPin + stringValue,
            }));
          }
        }
      }
    }
  };

  const retryPin = () => {
    setPin({
      firstPin: "",
      secondPin: "",
    });
  };

  const position2 = useRef(new Animated.Value(0)).current;
  const position1 = useRef(new Animated.Value(0)).current;
  const position3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(position3, {
      toValue: height / 2 - 400, // Adjust to move the second input downwards from the center
      duration: 1000,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
    Animated.timing(position1, {
      toValue: height / 2 - 350, // Adjust to move the second input downwards from the center
      duration: 1000,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
    Animated.timing(position2, {
      toValue: height / 2 - 300, // Adjust to move the second input downwards from the center
      duration: 1000,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, [position2, position1, position3]);
  /////////////////////////////////////////////////////////////////////////////////////////////
  const numbersArray: (number | React.ReactNode)[] = Array.from(
    { length: 12 },
    (_, index) => {
      if (index === 9) return 12; // Icon before 0
      if (index === 11) return 13;
      return index <= 9 ? index : index - 1; // Counting from 1 to 9
    }
  );
  const monitorInput = async () => {
    if (pin.firstPin === pin.secondPin) {
      await setSecurePin();
    } else {
      setActionStatus("failed");
      showNotification("Pin does not match");
      setRetryFunction(retryPin);
      setSecondStage(false);
    }
  };
  useEffect(() => {
    if (pin.firstPin.length > 3) {
      setSecondStage(true);
    }
    if (pin.secondPin.length > 3) {
      setActionStatus("loading");
      monitorInput();
    }
  }, [pin.firstPin, pin.secondPin]);
  const renderItem = ({ item }: { item: number }) => (
    <View style={{ padding: 10 }}>
      <CircleComponent number={item} theme={theme} handleInput={handleInput} />
    </View>
  );

  return (
    <ThemedView style={{ flex: 1 }}>
      <Animated.View style={[{ transform: [{ translateY: position3 }] }]}>
        <ThemedText style={{ letterSpacing: 5, fontSize: 30, lineHeight: 50 }}>
          {secondStage
            ? "Re-enter transaction pin to confirm"
            : "Enter your transaction pin"}
        </ThemedText>
      </Animated.View>
      <Animated.View style={[{ transform: [{ translateY: position1 }] }]}>
        <ThemedView
          style={{
            backgroundColor: Colors[theme].tint,
            borderWidth: 1,
            borderColor: "gray",
            borderRadius: 10,
            width: "100%",
          }}
        >
          <ThemedText style={{ letterSpacing: 20 }}>
            {secondStage ? pin.secondPin : pin.firstPin}
          </ThemedText>
        </ThemedView>
      </Animated.View>

      <Animated.View style={[{ transform: [{ translateY: position2 }] }]}>
        <ThemedView>
          <FlatList
            data={numbersArray}
            renderItem={renderItem}
            numColumns={3}
            columnWrapperStyle={{
              alignItems: "center",
              justifyContent: "center",
            }}
            keyExtractor={(item) => item.toString()}
          />
        </ThemedView>
      </Animated.View>
    </ThemedView>
  );
}
