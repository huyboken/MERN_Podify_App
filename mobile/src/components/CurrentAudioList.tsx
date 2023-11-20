import AudioListModal from '@ui/AudioListModal';
import React, {FC} from 'react';
import {StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import useAudioController from 'src/hooks/useAudioController';
import {getPlayerState} from 'src/store/player';

interface Props {
  visible: boolean;
  onRequestClose(): void;
}

const CurrentAudioList: FC<Props> = ({visible, onRequestClose}) => {
  const {onGoingList} = useSelector(getPlayerState);
  const {onAudioPress} = useAudioController();
  return (
    <AudioListModal
      visible={visible}
      onRequestClose={onRequestClose}
      header="Audio on the way"
      data={onGoingList}
      // loading
      onItemPress={onAudioPress}
    />
  );
};

export default CurrentAudioList;

const styles = StyleSheet.create({
  container: {},
});
