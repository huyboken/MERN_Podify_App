import colors from '@utils/colors';
import React, {FC} from 'react';
import {FlexStyle, StyleSheet, View} from 'react-native';

interface Props {
  size: number;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const CircleUi: FC<Props> = ({size, position}) => {
  let viewPosition: FlexStyle = {};

  switch (position) {
    case 'top-left':
      viewPosition = {top: -size / 2, left: -size / 2};
      break;
    case 'top-right':
      viewPosition = {top: -size / 2, right: -size / 2};
      break;
    case 'bottom-left':
      viewPosition = {bottom: -size / 2, left: -size / 2};
      break;
    case 'bottom-right':
      viewPosition = {bottom: -size / 2, right: -size / 2};
      break;
  }
  return (
    <View
      style={{
        height: size,
        width: size,
        position: 'absolute',
        ...viewPosition,
      }}>
      <View
        style={{
          height: size,
          width: size,
          borderRadius: size / 2,
          backgroundColor: colors.SECONDARY,
          opacity: 0.3,
        }}></View>
      <View
        style={{
          height: size / 1.5,
          width: size / 1.5,
          borderRadius: size / 2,
          position: 'absolute',
          top: '50%',
          left: '50%',
          backgroundColor: colors.SECONDARY,
          opacity: 0.3,
          transform: [{translateX: -size / 3}, {translateY: -size / 3}],
        }}
      />
    </View>
  );
};

export default CircleUi;

const styles = StyleSheet.create({
  container: {},
});
