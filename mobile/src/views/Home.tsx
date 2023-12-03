import LatestUploads from '@components/LatestUploads';
import OptionsModal from '@components/OptionsModal';
import PlaylistForm, {PlaylistInfo} from '@components/PlaylistForm';
import PlaylistModal from '@components/PlaylistModal';
import RecommendedAudios from '@components/RecommendedAudios';
import {AudioData, Playlist} from 'src/@types/audio';
import catchAsyncError from 'src/api/catchError';
import {getClient} from 'src/api/client';
import {useFetchPlaylist} from 'src/hooks/query';
import useAudioController from 'src/hooks/useAudioController';
import {updateNotification} from 'src/store/notification';
import colors from '@utils/colors';
import React, {FC, useEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch} from 'react-redux';
import AppView from '@components/AppView';
import RecentlyPlayed from '@components/RecentlyPlayed';
import RecommendedPlaylist from '@components/RecommendedPlaylist';
import {
  updatePlaylistVisibility,
  updateSelectedList,
} from 'src/store/playlistModal';

interface Props {}

const Home: FC<Props> = props => {
  const dispatch = useDispatch();
  const [showOptions, setShowOptions] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<AudioData>();
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [showPlaylistForm, setShowPlaylistForm] = useState(false);

  const {data} = useFetchPlaylist();
  const {onAudioPress} = useAudioController();

  const handleFavPress = async () => {
    if (!selectedAudio) return;

    try {
      const client = await getClient();
      const {data} = await client.post('/favorite?audioId=' + selectedAudio.id);
      console.log(data);
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(updateNotification({type: 'error', message: errorMessage}));
    }
    setSelectedAudio(undefined);
    setShowOptions(false);
  };

  const handleOnLongPress = (audio: AudioData) => {
    setSelectedAudio(audio);
    setShowOptions(true);
  };

  const handleOnAddToPlaylist = () => {
    setShowOptions(false);
    setShowPlaylistModal(true);
  };

  const handlePlaylistSubmit = async (value: PlaylistInfo) => {
    if (!value.title.trim()) return;
    try {
      const client = await getClient();
      const {data} = await client.post('/playlist/create', {
        title: value.title,
        visibility: value.private ? 'private' : 'public',
        resId: selectedAudio?.id,
      });
      console.log(data);
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(updateNotification({type: 'error', message: errorMessage}));
    }
  };

  const updatePlaylist = async (value: Playlist) => {
    try {
      const client = await getClient();
      const {data} = await client.patch('/playlist', {
        id: value.id,
        item: selectedAudio?.id,
        title: value.title,
        visibility: value.visibility,
      });
      console.log(data);
      setSelectedAudio(undefined);
      setShowPlaylistModal(false);
      dispatch(
        updateNotification({message: 'New audio added.', type: 'success'}),
      );
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(updateNotification({type: 'error', message: errorMessage}));
    }
  };

  const handleOnListPress = (playlist: Playlist) => {
    dispatch(updateSelectedList(playlist.id));
    dispatch(updatePlaylistVisibility(true));
  };

  return (
    <AppView>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.space}>
          <RecentlyPlayed />
        </View>
        <View style={styles.space}>
          <LatestUploads
            onAudioPress={onAudioPress}
            onAudioLongPress={handleOnLongPress}
          />
        </View>
        <View style={styles.space}>
          <RecommendedAudios
            onAudioPress={onAudioPress}
            onAudioLongPress={handleOnLongPress}
          />
        </View>
        <View style={styles.space}>
          <RecommendedPlaylist onListPress={handleOnListPress} />
        </View>
        <OptionsModal
          visible={showOptions}
          onRequestClose={() => setShowOptions(false)}
          options={[
            {
              title: 'Add to playlist',
              icon: 'playlist-music',
              onPress: handleOnAddToPlaylist,
            },
            {
              title: 'Add to favorite',
              icon: 'cards-heart',
              onPress: handleFavPress,
            },
          ]}
          renderItem={item => (
            <Pressable style={styles.optionContainer} onPress={item.onPress}>
              <MaterialCommunityIcons
                size={24}
                color={colors.PRIMARY}
                name={item.icon}
              />
              <Text style={styles.optionLabel}>{item.title}</Text>
            </Pressable>
          )}
        />
        <PlaylistModal
          visible={showPlaylistModal}
          onRequestClose={() => setShowPlaylistModal(false)}
          list={data || []}
          onCreateNewPress={() => {
            setShowPlaylistForm(true);
            setShowPlaylistModal(false);
          }}
          onPlaylistPress={updatePlaylist}
        />
        <PlaylistForm
          visible={showPlaylistForm}
          onRequestClose={() => setShowPlaylistForm(false)}
          onSubmit={handlePlaylistSubmit}
        />
      </ScrollView>
    </AppView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  space: {
    marginBottom: 15,
  },
  optionContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: 16,
    color: colors.PRIMARY,
    marginLeft: 5,
  },
});
