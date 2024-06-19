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
const { width, height } = Dimensions.get("window");
const CircleComponent = (props: {
  number: any;
  theme: any;
  handleInput: (value: string) => void;
}) => {
  return (
    <TouchableOpacity
      style={{
        borderRadius: 100,
        height: 70,
        width: 70,
        backgroundColor: Colors[props.theme].tint,
        alignItems: "center",
        justifyContent: "center",
      }}
      onPress={() => props.handleInput(props.number)}
    >
      <ThemedText>{props.number}</ThemedText>
    </TouchableOpacity>
  );
};

export default function PinSecure() {
  const theme = useColorScheme() ?? "light";
  const [pin, setPin] = useState({
    firstPin: "",
    secondPin: "",
  });
  const handleInput = (value: string) => {
    if (pin.firstPin.length <= 5) {
      setPin((prevPin) => ({ ...prevPin, firstPin: prevPin.firstPin + value }));
    } else {
      setPin((prevPin) => ({ ...prevPin, secondPin: value }));
    }
  };
  const position2 = useRef(new Animated.Value(0)).current;
  const position1 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(position1, {
      toValue: height / 2 - 200, // Adjust to move the second input downwards from the center
      duration: 1000,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
    Animated.timing(position2, {
      toValue: height / 2 - 200, // Adjust to move the second input downwards from the center
      duration: 1000,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, [position2, position1]);
  /////////////////////////////////////////////////////////////////////////////////////////////
  const numbersArray: number[] = Array.from(
    { length: 10 },
    (_, index) => index
  );

  const renderItem = ({ item }: { item: number }) => (
    <View style={{ padding: 10 }}>
      <CircleComponent number={item} theme={theme} handleInput={handleInput} />
    </View>
  );

  return (
    <ThemedView style={{ flex: 1 }}>
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
          <ThemedText style={{ letterSpacing: 20 }}>{pin.firstPin}</ThemedText>
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
