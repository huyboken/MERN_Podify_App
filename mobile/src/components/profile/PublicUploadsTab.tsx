import {NativeStackScreenProps} from '@react-navigation/native-stack';
import AudioListItem from '@ui/AudioListItem';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyRecords from '@ui/EmptyRecords';
import React, {FC} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {PublicProfileTabParamsList} from 'src/@types/navigation';
import {useFetchPublicUploads} from 'src/hooks/query';
import useAudioController from 'src/hooks/useAudioController';
import {getPlayerState} from 'src/store/player';

type Props = NativeStackScreenProps<
  PublicProfileTabParamsList,
  'PublicUploads'
>;

const PublicUploadsTab: FC<Props> = ({route}) => {
  const {data, isLoading} = useFetchPublicUploads(route.params.profileId);
  const {onGoingAudio} = useSelector(getPlayerState);
  const {onAudioPress} = useAudioController();

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

export default PublicUploadsTab;

const styles = StyleSheet.create({
  container: {},
});
