import AppModal from '@ui/AppModal';
import AudioListItem from '@ui/AudioListItem';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import colors from '@utils/colors';
import React, {FC} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useFetchPlaylistAudios} from 'src/hooks/query';
import useAudioController from 'src/hooks/useAudioController';
import {getPlayerState} from 'src/store/player';
import {
  getPlaylistModalState,
  updatePlaylistVisibility,
} from 'src/store/playlistModal';

interface Props {}

const PlaylistAudioModal: FC<Props> = props => {
  const dispatch = useDispatch();
  const {onAudioPress} = useAudioController();
  const {onGoingAudio} = useSelector(getPlayerState);
  const {visible, selectedListId} = useSelector(getPlaylistModalState);
  const {data, isLoading} = useFetchPlaylistAudios(selectedListId || '');

  const handleClose = () => {
    dispatch(updatePlaylistVisibility(false));
  };

  if (isLoading) {
    return (
      <AppModal visible={visible} onRequestClose={handleClose}>
        <View style={styles.container}>
          <AudioListLoadingUI />
        </View>
      </AppModal>
    );
  }

  return (
    <AppModal visible={visible} onRequestClose={handleClose}>
      <Text style={styles.title}>{data?.title}</Text>
      <FlatList
        contentContainerStyle={styles.container}
        data={data?.audios}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          return (
            <AudioListItem
              isPlaying={onGoingAudio?.id === item.id}
              onPress={() => onAudioPress(item, data?.audios || [])}
              audio={item}
            />
          );
        }}
      />
    </AppModal>
  );
};

export default PlaylistAudioModal;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    color: colors.CONTRAST,
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
  },
});
