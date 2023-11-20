import colors from '@utils/colors';
import React, {FC, ReactNode, useEffect} from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  children: ReactNode;
  visible: boolean;
  animation?: boolean;
  onRequestClose(): void;
}

const {height} = Dimensions.get('window');

const modalHeight = height - 150;

const AppModal: FC<Props> = ({
  children,
  visible,
  onRequestClose,
  animation,
}) => {
  const translateY = useSharedValue(modalHeight);

  const translateStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));

  const handleClosse = () => {
    translateY.value = modalHeight;
    onRequestClose();
  };

  const gesture = Gesture.Pan()
    .onUpdate(e => {
      if (e.translationY <= 0) return;
      translateY.value = e.translationY;
    })
    .onFinalize(e => {
      if (e.translationY <= modalHeight / 4) translateY.value = 0;
      else {
        translateY.value = modalHeight;
        runOnJS(handleClosse)();
      }
    });

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, {duration: animation ? 200 : 0});
    }
  }, [visible, animation]);

  return (
    <Modal
      style={styles.container}
      transparent
      visible={visible}
      onRequestClose={handleClosse}>
      <GestureHandlerRootView style={{flex: 1}}>
        <Pressable onResponderEnd={handleClosse} style={styles.backrop} />
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.modal, translateStyle]}>
            <SafeAreaView style={{flex: 1}}>{children}</SafeAreaView>
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
};

export default AppModal;

const styles = StyleSheet.create({
  container: {},
  backrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.OVERLAY,
  },
  modal: {
    backgroundColor: colors.PRIMARY,
    height: modalHeight,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    overflow: 'hidden',
  },
});
