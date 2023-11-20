import colors from '@utils/colors';
import React, {FC} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface Props {
  color?: string;
  playing?: boolean;
  onPress?(): void;
}

const PlayPauseBtn: FC<Props> = ({
  color = colors.CONTRAST,
  playing,
  onPress,
}) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <AntDesign
        name={playing ? 'pause' : 'caretright'}
        color={color}
        size={24}
      />
    </Pressable>
  );
};

export default PlayPauseBtn;

const styles = StyleSheet.create({
  button: {
    height: 45,
    width: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
