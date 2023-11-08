import {AudioData} from '@src/@type/audio';
import {useFetchRecommendedAudios} from '@src/hooks/query';
import GridView from '@ui/GridView';
import PulseAnimationContainer from '@ui/PulseAnimationContainer';
import colors from '@utils/colors';
import React, {FC} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';

interface Props {
  onAudioPress(item: AudioData, data: AudioData[]): void;
  onAudioLongPress(item: AudioData, data: AudioData[]): void;
}
const dumnyData = new Array(10).fill('');

const RecommendedAudios: FC<Props> = ({onAudioPress, onAudioLongPress}) => {
  const {data = [], isLoading} = useFetchRecommendedAudios();

  const getPoster = (poster?: string) => {
    return poster ? {uri: poster} : require('../assets/music.png');
  };

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
      <Text style={styles.title}>Recommended</Text>
      <View style={{width: '100%', flexDirection: 'row', flexWrap: 'wrap'}}>
        <GridView
          data={data || []}
          col={3}
          renderItem={item => {
            return (
              <Pressable
                onPress={() => onAudioPress(item, data)}
                onLongPress={() => onAudioLongPress(item, data)}>
                <Image style={styles.poster} source={getPoster(item.poster)} />
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={styles.audioTitle}>
                  {item.title}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>
    </View>
  );
};

export default RecommendedAudios;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
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
