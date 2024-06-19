import React, { useRef, useEffect } from "react";
import {
  Pressable,
  Animated,
  View,
  StyleSheet,
  StyleProp,
  Text,
  ViewStyle,
  Alert,
  TextStyle,
} from "react-native";
import { Colors, accent } from "./Colors";
interface ButtonProps {
  text: string;
  styles?: StyleProp<ViewStyle>;
  textStyles?: StyleProp<TextStyle>;
}
export const KallumButton = (props: ButtonProps) => {
  const scale = useRef(new Animated.Value(1)).current;
  const hue = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 0.8,
        useNativeDriver: true,
      }),

      Animated.timing(hue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
    Alert.alert("peace");
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(hue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const backgroundColor = hue.interpolate({
    inputRange: [0, 1],
    outputRange: ["hsl(0, 100%, 50%)", "hsl(360, 100%, 50%)"],
  });

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View
        style={[
          styles.button,
          { transform: [{ scale }], backgroundColor: accent },
          props.styles,
        ]}
      >
        <Text
          style={[
            { color: Colors.light.background, fontWeight: 600, fontSize: 16 },
            props.textStyles,
          ]}
        >
          {props.text}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});
