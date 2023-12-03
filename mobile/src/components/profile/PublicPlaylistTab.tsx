import {NativeStackScreenProps} from '@react-navigation/native-stack';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyRecords from '@ui/EmptyRecords';
import PlaylistItem from '@ui/PlaylistItem';
import React, {FC} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {useDispatch} from 'react-redux';
import {Playlist} from 'src/@types/audio';
import {PublicProfileTabParamsList} from 'src/@types/navigation';
import {useFetchPublicPlaylist} from 'src/hooks/query';
import {
  updatePlaylistVisibility,
  updateSelectedList,
} from 'src/store/playlistModal';

type Props = NativeStackScreenProps<
  PublicProfileTabParamsList,
  'PublicPlaylist'
>;

const PublicPlaylistTab: FC<Props> = ({route}) => {
  const dispatch = useDispatch();
  const {data, isLoading} = useFetchPublicPlaylist(route.params.profileId);

  const handleOnListPress = (playlist: Playlist) => {
    dispatch(updateSelectedList(playlist.id));
    dispatch(updatePlaylistVisibility(true));
  };

  if (isLoading) return <AudioListLoadingUI />;

  return (
    <ScrollView style={styles.container}>
      {!data?.length && <EmptyRecords title="There is no playlist audio!" />}
      {data?.map(playlist => {
        return (
          <PlaylistItem
            onPress={() => handleOnListPress(playlist)}
            playlist={playlist}
            key={playlist.id}
          />
        );
      })}
    </ScrollView>
  );
};

export default PublicPlaylistTab;

const styles = StyleSheet.create({
  container: {},
});
