import Slider from '@react-native-community/slider';
import AppLink from '@ui/AppLink';
import AppModal from '@ui/AppModal';
import Loader from '@ui/Loader';
import PlayController from '@ui/PlayController';
import PlayPauseBtn from '@ui/PlayPauseBtn';
import PlaybackRateSelector from '@ui/PlaybackRateSelector';
import colors from '@utils/colors';
import formatDuration from 'format-duration';
import React, {FC, useState} from 'react';
import {StyleSheet, View, Image, Text, Pressable} from 'react-native';
import {useProgress} from 'react-native-track-player';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import useAudioController from 'src/hooks/useAudioController';
import {getPlayerState, updatePlaybackRate} from 'src/store/player';
import AudioInfoContainer from './AudioInfoContainer';

interface Props {
  visible: boolean;
  onRequestClose(): void;
  onListOptionPress?(): void;
  onProfileLinkPress?(): void;
}

const formattedDuration = (duration = 0) => {
  return formatDuration(duration, {leading: true});
};

const AudioPlayer: FC<Props> = ({
  visible,
  onRequestClose,
  onListOptionPress,
  onProfileLinkPress,
}) => {
  const dispatch = useDispatch();
  const {onGoingAudio, playbackRate} = useSelector(getPlayerState);
  const {duration, position} = useProgress();
  const {
    seekTo,
    isBusy,
    isPlaying,
    skipTo,
    tooglePlayPause,
    onNextPress,
    onPreviousPress,
    setPlaybackRate,
  } = useAudioController();
  const poster = onGoingAudio?.poster;
  const source = poster ? {uri: poster} : require('../assets/music.png');

  const [showAudioInfo, setShowAudioInfo] = useState(false);

  const updateSeek = async (value: number) => {
    await seekTo(value);
  };

  const handleSkipTo = (skipType: 'forward' | 'reverse') => async () => {
    if (skipType === 'forward') await skipTo(10);
    if (skipType === 'reverse') await skipTo(-10);
  };

  const handleOnNextPress = async () => {
    await onNextPress();
  };

  const handleOnPreviousPress = async () => {
    await onPreviousPress();
  };

  const onPlaybackRatePress = async (rate: number) => {
    await setPlaybackRate(rate);
    dispatch(updatePlaybackRate(rate));
  };

  return (
    <AppModal animation visible={visible} onRequestClose={onRequestClose}>
      <View style={styles.container}>
        <Pressable
          onPress={() => setShowAudioInfo(true)}
          style={styles.infoBtn}>
          <AntDesign name="infocirlceo" color={colors.CONTRAST} size={24} />
        </Pressable>
        <AudioInfoContainer
          visible={showAudioInfo}
          closerHandle={setShowAudioInfo}
        />
        <Image source={source} style={styles.poster} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{onGoingAudio?.title}</Text>

          <AppLink
            onPress={onProfileLinkPress}
            title={onGoingAudio?.owner.name || ''}
          />
          <View style={styles.durationContainer}>
            <Text style={styles.duration}>
              {formattedDuration(position * 1000)}
            </Text>
            <Text style={styles.duration}>
              {formattedDuration(duration * 1000)}
            </Text>
          </View>
          <Slider
            minimumValue={0}
            maximumValue={duration}
            minimumTrackTintColor={colors.CONTRAST}
            maximumTrackTintColor={colors.INACTIVE_CONTRAST}
            value={position}
            onSlidingComplete={updateSeek}
          />
          <View style={styles.controls}>
            {/* Previous */}
            <PlayController onPress={handleOnPreviousPress} ignoreContainer>
              <AntDesign
                name="stepbackward"
                size={24}
                color={colors.CONTRAST}
              />
            </PlayController>

            {/* Skip time left */}
            <PlayController onPress={handleSkipTo('reverse')} ignoreContainer>
              <Feather name="rotate-ccw" size={24} color={colors.CONTRAST} />
              <Text style={styles.textSkip}>10</Text>
            </PlayController>

            {/* Play Pause */}
            <PlayController>
              {isBusy ? (
                <Loader color={colors.PRIMARY} />
              ) : (
                <PlayPauseBtn
                  onPress={tooglePlayPause}
                  color={colors.PRIMARY}
                  playing={isPlaying}
                />
              )}
            </PlayController>

            {/* Skip time right */}
            <PlayController onPress={handleSkipTo('forward')} ignoreContainer>
              <Feather name="rotate-cw" size={24} color={colors.CONTRAST} />
              <Text style={styles.textSkip}>10</Text>
            </PlayController>

            {/* Next */}
            <PlayController onPress={handleOnNextPress} ignoreContainer>
              <AntDesign name="stepforward" size={24} color={colors.CONTRAST} />
            </PlayController>
          </View>
          <PlaybackRateSelector
            activeRate={playbackRate.toString()}
            onPress={onPlaybackRatePress}
            containerStyle={{marginTop: 20}}
          />
          <View style={styles.listOptionContainer}>
            <PlayController onPress={onListOptionPress} ignoreContainer>
              <MaterialCommunityIcons
                name="playlist-music"
                size={24}
                color={colors.CONTRAST}
              />
            </PlayController>
          </View>
        </View>
      </View>
    </AppModal>
  );
};

export default AudioPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  poster: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  contentContainer: {
    width: '100%',
    flex: 1,
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.CONTRAST,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  duration: {
    color: colors.CONTRAST,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  textSkip: {
    fontSize: 8,
    marginTop: 2,
    color: colors.CONTRAST,
    position: 'absolute',
  },
  infoBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  listOptionContainer: {
    alignItems: 'flex-end',
  },
});
