import {useFetchUploadsByProfile} from 'src/hooks/query';
import AudioListItem from '@ui/AudioListItem';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyRecords from '@ui/EmptyRecords';
import React, {FC} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import useAudioController from 'src/hooks/useAudioController';
import {useSelector} from 'react-redux';
import {getPlayerState} from 'src/store/player';

interface Props {}

const UploadsTab: FC<Props> = props => {
  const {onGoingAudio} = useSelector(getPlayerState);
  const {onAudioPress} = useAudioController();
  const {data, isLoading} = useFetchUploadsByProfile();

  if (isLoading) return <AudioListLoadingUI />;

  if (!data?.length) return <EmptyRecords title="There is no audio!" />;

  return (
    <ScrollView style={styles.container}>
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

export default UploadsTab;

const styles = StyleSheet.create({
  container: {},
});
