import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  Animated,
  Text,
  StyleSheet,
  TextInputProps,
  useColorScheme,
} from "react-native";
import { Colors, accent } from "./Colors";

interface KallumInputProps extends TextInputProps {
  label: string;
  value?: string;
  setValue?: React.Dispatch<React.SetStateAction<string>>;
  styles?: {};
}

const KallumInput: React.FC<KallumInputProps> = ({
  label,
  value,
  setValue,
  styles,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedIsFocused = useRef(new Animated.Value(0)).current;
  const theme = useColorScheme() ?? "light";

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animatedIsFocused, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(animatedIsFocused, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const inputStyle = {
    cursorColor: accent,
    placeholderTextColor: Colors[theme].text,
  };

  const labelStyle = {
    position: "absolute" as "absolute",
    left: 0,
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -10],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    fontWidth: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: ["500", "500"],
    }),
    color: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [value && value.length > 0 ? "transparent" : "#aaa", accent],
    }),
    backgroundColor: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: ["transparent", Colors[theme].background],
    }),
    paddingHorizontal: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [10, 5],
    }),
  };

  const viewStyle = {
    borderWidth: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 2],
    }),
    borderRadius: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [10, 10],
    }),
    borderColor: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [accent, accent],
    }),
    padding: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0],
    }),
  };

  return (
    <View style={[defaultStyles.container, styles]}>
      <Animated.View style={viewStyle}>
        <Animated.Text style={labelStyle}>{label}</Animated.Text>
        <TextInput
          {...props}
          style={[
            defaultStyles.input,
            props.style,
            { color: Colors[theme].text, padding: 20 },
          ]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          blurOnSubmit
          value={value}
          onChangeText={setValue}
          {...inputStyle}
        />
      </Animated.View>
    </View>
  );
};

const defaultStyles = StyleSheet.create({
  container: {
    paddingTop: 18,
    marginVertical: 12,
  },
  input: {
    height: 60,
    fontSize: 16,
  },
});

export default KallumInput;
