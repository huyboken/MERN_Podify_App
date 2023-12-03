import Loader from '@ui/Loader';
import PlayPauseBtn from '@ui/PlayPauseBtn';
import colors from '@utils/colors';
import {mapRange} from '@utils/math';
import React, {FC, useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {useProgress} from 'react-native-track-player';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';
import useAudioController from 'src/hooks/useAudioController';
import {getPlayerState} from 'src/store/player';
import AudioPlayer from './AudioPlayer';
import CurrentAudioList from './CurrentAudioList';
import {useFetchIsFavorite} from 'src/hooks/query';
import {useMutation, useQueryClient} from 'react-query';
import {getClient} from 'src/api/client';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {HomeNavigatorParamList} from 'src/@types/navigation';
import {getAuthState} from 'src/store/auth';

interface Props {}

export const MiniPlayerHeight = 60;

const MiniAudioPlayer: FC<Props> = props => {
  const {navigate} = useNavigation<NavigationProp<HomeNavigatorParamList>>();
  const {onGoingAudio} = useSelector(getPlayerState);
  const {profile} = useSelector(getAuthState);
  const {isPlaying, isBusy, tooglePlayPause} = useAudioController();
  const {data: isFav} = useFetchIsFavorite(onGoingAudio?.id || '');
  const process = useProgress();

  const [playerVisibility, setPlayerVisibility] = useState(false);
  const [showCurrentLsit, setShowCurrentList] = useState(false);

  const queryClient = useQueryClient();

  const toogleIsFav = async (id: string) => {
    if (!id) return;
    const client = await getClient();
    await client.post('/favorite?audioId=' + id);
  };

  const favoriteMutation = useMutation({
    mutationFn: async id => await toogleIsFav(id),
    onMutate: (id: string) => {
      queryClient.setQueryData<boolean>(
        ['favorite', onGoingAudio?.id],
        oldData => !oldData,
      );
    },
  });

  const closePlayerModal = () => setPlayerVisibility(false);
  const showPlayerModal = () => setPlayerVisibility(true);
  const handleOnCurrentListClose = () => setShowCurrentList(false);
  const handleOnListOptionPress = () => {
    closePlayerModal();
    setShowCurrentList(true);
  };

  const handleOnProfileLinkPress = () => {
    closePlayerModal();
    if (profile?.id === onGoingAudio?.owner.id) {
      navigate('ProfileNavigator', {screens: 'Profile'});
    } else {
      navigate('PublicProfile', {profileId: onGoingAudio?.owner.id || ''});
    }
  };

  const poster = onGoingAudio?.poster;
  const source = poster ? {uri: poster} : require('../assets/music.png');

  return (
    <>
      <View
        style={{
          height: 2,
          backgroundColor: colors.SECONDARY,
          width: `${mapRange({
            outputMin: 0,
            outputMax: 100,
            inputMin: 0,
            inputMax: process.duration,
            inputValue: process.position,
          })}%`,
        }}
      />
      <View style={styles.container}>
        <Image source={source} style={styles.poster} />
        <Pressable onPress={showPlayerModal} style={styles.contentContainer}>
          <Text style={styles.title}>{onGoingAudio?.title}</Text>
          <Text style={styles.name}>{onGoingAudio?.owner.name}</Text>
        </Pressable>
        <Pressable
          onPress={() => favoriteMutation.mutate(onGoingAudio?.id || '')}
          style={{paddingHorizontal: 10}}>
          <AntDesign
            name={isFav ? 'heart' : 'hearto'}
            color={colors.CONTRAST}
            size={24}
          />
        </Pressable>
        {isBusy ? (
          <Loader />
        ) : (
          <PlayPauseBtn playing={isPlaying} onPress={tooglePlayPause} />
        )}
      </View>
      <AudioPlayer
        visible={playerVisibility}
        onRequestClose={closePlayerModal}
        onListOptionPress={handleOnListOptionPress}
        onProfileLinkPress={handleOnProfileLinkPress}
      />
      <CurrentAudioList
        visible={showCurrentLsit}
        onRequestClose={handleOnCurrentListClose}
      />
    </>
  );
};

export default MiniAudioPlayer;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: MiniPlayerHeight,
    backgroundColor: colors.OVERLAY,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  poster: {
    height: MiniPlayerHeight - 10,
    width: MiniPlayerHeight - 10,
    borderRadius: 5,
  },
  contentContainer: {
    flex: 1,
    height: '100%',
    padding: 5,
  },
  title: {
    color: colors.CONTRAST,
    fontWeight: '700',
    paddingHorizontal: 5,
  },
  name: {
    color: colors.SECONDARY,
    fontWeight: '700',
    paddingHorizontal: 5,
  },
});
