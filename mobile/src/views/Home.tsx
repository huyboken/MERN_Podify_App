import LatestUploads from '@components/LatestUploads';
import RecommendedAudios from '@components/RecommendedAudios';
import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';

interface Props {}

const Home: FC<Props> = props => {
  return (
    <View style={styles.container}>
      <LatestUploads onAudioPress={() => {}} onAudioLongPress={() => {}} />
      <RecommendedAudios onAudioPress={() => {}} onAudioLongPress={() => {}} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});
