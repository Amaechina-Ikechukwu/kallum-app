import { Image, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated";

export function HelloWave() {
  const bounceAnimation = useSharedValue(0);

  bounceAnimation.value = withRepeat(
    withSequence(
      withTiming(-10, { duration: 500 }),
      withTiming(0, { duration: 150 })
    ),
    4, // Run the animation 4 times
    true // Reverse animation on repeat
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounceAnimation.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Image
        source={require("@/assets/images/kallumSymbol.png")}
        style={{ height: 100, width: 100 }}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 28,
    lineHeight: 32,
    marginTop: -6,
  },
});
