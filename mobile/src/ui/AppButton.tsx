import colors from '@utils/colors';
import React, {FC} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Loader from './Loader';

interface Props {
  title: string;
  onPress?(): void;
  busy?: boolean;
}

const AppButton: FC<Props> = ({title, onPress, busy}) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
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
    borderRadius: 25,
  },
  title: {
    color: colors.CONTRAST,
    fontSize: 18,
  },
});
