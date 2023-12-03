import GridView from '@ui/GridView';
import PulseAnimationContainer from '@ui/PulseAnimationContainer';
import RecentlyPlayedCard from '@ui/RecentlyPlayedCard';
import colors from '@utils/colors';
import React, {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {useFetchRecentlyPlayed} from 'src/hooks/query';
import useAudioController from 'src/hooks/useAudioController';
import {getPlayerState} from 'src/store/player';

interface Props {}

const dummyData = new Array(4).fill('');

const RecentlyPlayed: FC<Props> = props => {
  const {data = [], isLoading} = useFetchRecentlyPlayed();
  const {onGoingAudio} = useSelector(getPlayerState);
  const {onAudioPress} = useAudioController();

  if (isLoading) {
    return (
      <PulseAnimationContainer>
        <View style={styles.dummyTitleView} />
        <GridView
          data={dummyData}
          renderItem={() => <View style={styles.dummyView} />}
        />
      </PulseAnimationContainer>
    );
  }

  if (!data.length) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recently Played</Text>
      <GridView
        data={data}
        renderItem={item => {
          return (
            <View key={item.id} style={styles.listStyle}>
              <RecentlyPlayedCard
                title={item.title}
                poster={item.poster}
                onPress={() => onAudioPress(item, data)}
                isPlaying={onGoingAudio?.id === item.id}
              />
            </View>
          );
        }}
      />
    </View>
  );
};

export default RecentlyPlayed;

const styles = StyleSheet.create({
  container: {},
  title: {
    color: colors.CONTRAST,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  listStyle: {
    marginBottom: 10,
  },
  dummyView: {
    height: 50,
    width: '100%',
    backgroundColor: colors.INACTIVE_CONTRAST,
    marginBottom: 10,
    borderRadius: 5,
  },
  dummyTitleView: {
    height: 20,
    width: 150,
    backgroundColor: colors.INACTIVE_CONTRAST,
    marginBottom: 15,
    borderRadius: 5,
  },
});
