import {useFetchPlaylist} from 'src/hooks/query';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyRecords from '@ui/EmptyRecords';
import PlaylistItem from '@ui/PlaylistItem';
import React, {FC} from 'react';
import {StyleSheet, ScrollView} from 'react-native';

interface Props {}

const PlaylistTab: FC<Props> = props => {
  const {data, isLoading} = useFetchPlaylist();

  if (isLoading) return <AudioListLoadingUI />;

  if (!data?.length)
    return <EmptyRecords title="There is no playlist audio!" />;

  return (
    <ScrollView style={styles.container}>
      {data?.map(playlist => {
        return <PlaylistItem playlist={playlist} key={playlist.id} />;
      })}
    </ScrollView>
  );
};

export default PlaylistTab;

const styles = StyleSheet.create({
  container: {},
});
