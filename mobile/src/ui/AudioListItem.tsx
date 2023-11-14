import {AudioData} from '@src/@type/audio';
import colors from '@utils/colors';
import React, {FC} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';

interface Props {
  audio: AudioData;
  onPress?(): void;
}

const AudioListItem: FC<Props> = ({audio, onPress}) => {
  const getSource = (poster?: string) => {
    return poster ? {uri: poster} : require('../assets/music_small.png');
  };
  return (
    <Pressable onPress={onPress} style={styles.listItem} key={audio.id}>
      <Image source={getSource(audio.poster)} style={styles.poster} />
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
