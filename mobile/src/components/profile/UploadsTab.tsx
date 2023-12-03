import {useFetchUploadsByProfile} from 'src/hooks/query';
import AudioListItem from '@ui/AudioListItem';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyRecords from '@ui/EmptyRecords';
import React, {FC, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text} from 'react-native';
import useAudioController from 'src/hooks/useAudioController';
import {useSelector} from 'react-redux';
import {getPlayerState} from 'src/store/player';
import {AudioData} from 'src/@types/audio';
import OptionsModal from '@components/OptionsModal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '@utils/colors';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {ProfileNavigatorParamList} from 'src/@types/navigation';

interface Props {}

const UploadsTab: FC<Props> = props => {
  const {navigate} = useNavigation<NavigationProp<ProfileNavigatorParamList>>();
  const {onGoingAudio} = useSelector(getPlayerState);
  const {onAudioPress} = useAudioController();
  const {data, isLoading} = useFetchUploadsByProfile();

  const [showOptions, setShowOptions] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<AudioData>();

  const handleOnLongPress = (audio: AudioData) => {
    setSelectedAudio(audio);
    setShowOptions(true);
  };

  const handleOnEdit = () => {
    setShowOptions(false);
    if (selectedAudio) navigate('UpdateAudio', {audio: selectedAudio});
  };

  if (isLoading) return <AudioListLoadingUI />;

  if (!data?.length) return <EmptyRecords title="There is no audio!" />;

  return (
    <>
      <ScrollView style={styles.container}>
        {data?.map(item => {
          return (
            <AudioListItem
              audio={item}
              key={item.id}
              onPress={() => onAudioPress(item, data)}
              isPlaying={onGoingAudio?.id === item.id}
              onLongPress={() => handleOnLongPress(item)}
            />
          );
        })}
      </ScrollView>
      <OptionsModal
        visible={showOptions}
        onRequestClose={() => setShowOptions(false)}
        options={[
          {
            title: 'Edit',
            icon: 'edit',
            onPress: handleOnEdit,
          },
        ]}
        renderItem={item => (
          <Pressable style={styles.optionContainer} onPress={item.onPress}>
            <AntDesign size={24} color={colors.PRIMARY} name={item.icon} />
            <Text style={styles.optionLabel}>{item.title}</Text>
          </Pressable>
        )}
      />
    </>
  );
};

export default UploadsTab;

const styles = StyleSheet.create({
  container: {},
  optionContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: 16,
    color: colors.PRIMARY,
    marginLeft: 5,
  },
});
