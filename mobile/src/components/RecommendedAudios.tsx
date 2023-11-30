import {AudioData} from 'src/@types/audio';
import {useFetchRecommendedAudios} from 'src/hooks/query';
import GridView from '@ui/GridView';
import PulseAnimationContainer from '@ui/PulseAnimationContainer';
import colors from '@utils/colors';
import React, {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import AudioCard from '@ui/AudioCard';
import {useSelector} from 'react-redux';
import {getPlayerState} from 'src/store/player';

interface Props {
  onAudioPress(item: AudioData, data: AudioData[]): void;
  onAudioLongPress(item: AudioData, data: AudioData[]): void;
}
const dumnyData = new Array(10).fill('');

const RecommendedAudios: FC<Props> = ({onAudioPress, onAudioLongPress}) => {
  const {data = [], isLoading} = useFetchRecommendedAudios();
  const {onGoingAudio} = useSelector(getPlayerState);

  if (isLoading)
    return (
      <PulseAnimationContainer>
        <View style={styles.container}>
          <View style={styles.dummyTitleView} />
          <GridView
            data={dumnyData}
            col={3}
            renderItem={item => {
              return <View style={styles.dummyAudioView} />;
            }}
          />
        </View>
      </PulseAnimationContainer>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>You may like this</Text>
      <GridView
        data={data || []}
        col={3}
        renderItem={item => {
          return (
            <AudioCard
              title={item.title}
              poster={item.poster}
              onPress={() => onAudioPress(item, data)}
              onLongPress={() => onAudioLongPress(item, data)}
              containerStyle={{width: '100%'}}
              playing={onGoingAudio?.id === item.id}
            />
          );
        }}
      />
    </View>
  );
};

export default RecommendedAudios;

const styles = StyleSheet.create({
  container: {},
  title: {
    color: colors.CONTRAST,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  poster: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 7,
  },
  audioTitle: {
    color: colors.CONTRAST,
    fontSize: 16,
    fontWeight: '500',
    marginTop: 5,
  },
  dummyTitleView: {
    height: 20,
    width: 150,
    backgroundColor: colors.INACTIVE_CONTRAST,
    marginBottom: 15,
    borderRadius: 5,
  },

  dummyAudioView: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.INACTIVE_CONTRAST,
    borderRadius: 5,
  },
});
