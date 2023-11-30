import colors from '@utils/colors';
import React, {FC} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import PlayAnimation from './PlayAnimation';

interface Props {
  title: string;
  isPlaying?: boolean;
  poster?: string;
  onPress?(): void;
}

const RecentlyPlayedCard: FC<Props> = ({
  title,
  isPlaying = false,
  poster,
  onPress,
}) => {
  const getSource = poster ? {uri: poster} : require('../assets/music.png');
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View>
        <Image style={styles.poster} source={getSource} />
        <PlayAnimation visible={isPlaying} />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {title}
        </Text>
      </View>
    </Pressable>
  );
};

export default RecentlyPlayedCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.OVERLAY,
    width: '100%',
    borderRadius: 5,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  poster: {width: 50, height: 50},
  titleContainer: {
    flex: 1,
    padding: 5,
  },
  title: {
    color: colors.CONTRAST,
    fontWeight: '500',
  },
});
