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
  Dimensions,
} from "react-native";
import { Colors, accent } from "./Colors";
const { width } = Dimensions.get("window");
interface ButtonProps {
  text: string;
  styles?: StyleProp<ViewStyle>;
  textStyles?: StyleProp<TextStyle>;
  onPress?: () => void;
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
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={props.onPress}
    >
      <Animated.View
        style={[
          styles.button,
          {
            transform: [{ scale }],
            backgroundColor: accent,
            width: width * 0.9,
          },
          props.styles,
        ]}
      >
        <Text
          style={[
            { color: Colors.light.background, fontWeight: 600, fontSize: 20 },
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
