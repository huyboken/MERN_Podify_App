import colors from '@utils/colors';
import React, {FC, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  height: number;
  delay: number;
}

const AnimatedStroke: FC<Props> = ({height, delay}) => {
  const sharedValue = useSharedValue(5);

  const heightStyle = useAnimatedStyle(() => ({
    height: sharedValue.value,
  }));

  useEffect(() => {
    sharedValue.value = withDelay(
      delay,
      withRepeat(withTiming(height), -1, true),
    );
  }, []);
  return <Animated.View style={[styles.stroke, heightStyle]} />;
};

export default AnimatedStroke;

const styles = StyleSheet.create({
  stroke: {
    width: 4,
    backgroundColor: colors.CONTRAST,
    marginRight: 5,
  },
});
