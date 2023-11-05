import colors from '@utils/colors';
import React, {FC} from 'react';
import {Pressable, StyleProp, StyleSheet, Text, ViewStyle} from 'react-native';
import Loader from './Loader';

interface Props {
  title: string;
  onPress?(): void;
  busy?: boolean;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

const AppButton: FC<Props> = ({title, onPress, busy, borderRadius, style}) => {
  return (
    <Pressable
      style={[styles.container, {borderRadius: borderRadius || 25}, style]}
      onPress={onPress}>
      {!busy ? <Text style={styles.title}>{title}</Text> : <Loader />}
    </Pressable>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  container: {
    height: 45,
    width: '100%',
    backgroundColor: colors.SECONDARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.CONTRAST,
    fontSize: 18,
  },
});
