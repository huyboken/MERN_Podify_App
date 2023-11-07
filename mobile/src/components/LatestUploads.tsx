import {AudioData} from '@src/@type/audio';
import {useFetchLatestAudios} from '@src/hooks/query';
import AudioCard from '@ui/AudioCard';
import PulseAnimationContainer from '@ui/PulseAnimationContainer';
import colors from '@utils/colors';
import React, {FC} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';

interface Props {
  onAudioPress(item: AudioData, data: AudioData[]): void;
  onAudioLongPress(item: AudioData, data: AudioData[]): void;
}

const dummyData = new Array(10).fill('');

const LatestUploads: FC<Props> = ({onAudioPress, onAudioLongPress}) => {
  const {data, isLoading} = useFetchLatestAudios();

  if (isLoading)
    return (
      <PulseAnimationContainer>
        <View style={styles.container}>
          <View style={styles.dummyTitleView} />
          <View style={styles.dummyAudioContainer}>
            {dummyData.map((_, index) => {
              return <View key={index} style={styles.dummyAudioView} />;
            })}
          </View>
        </View>
      </PulseAnimationContainer>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Latest Uploads</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data?.map((item, index) => (
          <AudioCard
            key={item.id}
            title={item.title}
            poster={item.poster}
            onPress={() => onAudioPress(item, data)}
            onLongPress={() => onAudioLongPress(item, data)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default LatestUploads;

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  title: {
    color: colors.CONTRAST,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  dummyTitleView: {
    height: 20,
    width: 150,
    backgroundColor: colors.INACTIVE_CONTRAST,
    marginBottom: 15,
    borderRadius: 5,
  },
  dummyAudioContainer: {
    flexDirection: 'row',
  },
  dummyAudioView: {
    height: 100,
    width: 100,
    backgroundColor: colors.INACTIVE_CONTRAST,
    marginRight: 15,
    borderRadius: 5,
  },
});
