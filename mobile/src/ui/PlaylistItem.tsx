import {Playlist} from 'src/@types/audio';
import colors from '@utils/colors';
import React, {FC} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface Props {
  playlist: Playlist;
  onPress?(): void;
}

const PlaylistItem: FC<Props> = ({playlist, onPress}) => {
  const {id, itemsCount, title, visibility} = playlist;
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.posterContainer}>
        <MaterialCommunityIcons
          name="playlist-music"
          size={30}
          color={colors.CONTRAST}
        />
      </View>
      <View style={styles.contentContainer}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <View style={styles.iconContainer}>
          <FontAwesome
            name={visibility === 'public' ? 'globe' : 'lock'}
            color={colors.SECONDARY}
            size={15}
          />
          <Text style={styles.count}>
            {itemsCount} {itemsCount > 1 ? 'audios' : 'audio'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default PlaylistItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: colors.OVERLAY,
    marginBottom: 15,
  },
  posterContainer: {
    backgroundColor: colors.OVERLAY,
    height: 50,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    color: colors.CONTRAST,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 5,
  },
  iconContainer: {
    flexDirection: 'row',
    paddingTop: 4,
  },
  count: {
    color: colors.SECONDARY,
    marginLeft: 5,
    fontWeight: 'bold',
  },
});
