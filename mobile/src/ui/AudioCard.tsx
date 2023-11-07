import colors from '@utils/colors';
import React, {FC} from 'react';
import {Image, Pressable, StyleSheet, Text} from 'react-native';

interface Props {
  title: string;
  poster?: string;
  onPress?(): void;
  onLongPress?(): void;
}

const AudioCard: FC<Props> = ({title, poster, onPress, onLongPress}) => {
  const source = poster ? {uri: poster} : require('../assets/music.png');
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.container}>
      <Image style={styles.poster} source={source} />
      <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>
        {title}
      </Text>
    </Pressable>
  );
};

export default AudioCard;

const styles = StyleSheet.create({
  container: {width: 100, marginRight: 15},
  poster: {height: 100, borderRadius: 7, aspectRatio: 1},
  title: {
    color: colors.CONTRAST,
    fontSize: 16,
    fontWeight: '500',
    marginTop: 5,
  },
});
