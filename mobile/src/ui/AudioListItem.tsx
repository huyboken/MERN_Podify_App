import {AudioData} from 'src/@types/audio';
import colors from '@utils/colors';
import React, {FC} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import PlayAnimation from './PlayAnimation';

interface Props {
  audio: AudioData;
  onPress?(): void;
  isPlaying?: boolean;
}

const AudioListItem: FC<Props> = ({audio, onPress, isPlaying = false}) => {
  const getSource = (poster?: string) => {
    return poster ? {uri: poster} : require('../assets/music_small.png');
  };
  return (
    <Pressable onPress={onPress} style={styles.listItem} key={audio.id}>
      <View>
        <Image source={getSource(audio.poster)} style={styles.poster} />
        <PlayAnimation visible={isPlaying} />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title} ellipsizeMode="tail" numberOfLines={1}>
          {audio.title}
        </Text>
        <Text style={styles.owner} ellipsizeMode="tail" numberOfLines={1}>
          {audio.owner.name}
        </Text>
      </View>
    </Pressable>
  );
};

export default AudioListItem;

const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    padding: 5,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: colors.OVERLAY,
    borderRadius: 5,
    overflow: 'hidden',
  },
  poster: {
    height: 50,
    width: 50,
  },
  title: {
    color: colors.CONTRAST,
    fontWeight: '700',
  },
  owner: {
    color: colors.SECONDARY,
    fontWeight: '700',
  },
});
