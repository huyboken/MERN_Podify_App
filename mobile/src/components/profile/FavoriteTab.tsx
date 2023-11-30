import {useFetchFavorite} from 'src/hooks/query';
import AudioListItem from '@ui/AudioListItem';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyRecords from '@ui/EmptyRecords';
import React, {FC} from 'react';
import {RefreshControl, ScrollView, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import useAudioController from 'src/hooks/useAudioController';
import {getPlayerState} from 'src/store/player';
import colors from '@utils/colors';
import {useQueryClient} from 'react-query';

interface Props {}

const FavoriteTab: FC<Props> = props => {
  const {onGoingAudio} = useSelector(getPlayerState);
  const {onAudioPress} = useAudioController();
  const {data, isLoading, isFetching} = useFetchFavorite();
  const queryClient = useQueryClient();

  const handleOnRefresh = () => {
    queryClient.invalidateQueries({queryKey: ['favorite']});
  };

  if (isLoading) return <AudioListLoadingUI />;

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={isFetching}
          tintColor={colors.CONTRAST}
          onRefresh={handleOnRefresh}
        />
      }
      style={styles.container}>
      {!data?.length && <EmptyRecords title="There is no favorite audio!" />}
      {data?.map(item => {
        return (
          <AudioListItem
            audio={item}
            key={item.id}
            onPress={() => onAudioPress(item, data)}
            isPlaying={onGoingAudio?.id === item.id}
          />
        );
      })}
    </ScrollView>
  );
};

export default FavoriteTab;

const styles = StyleSheet.create({
  container: {},
});
