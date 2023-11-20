import colors from '@utils/colors';
import React, {FC} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import AppModal from './AppModal';
import {AudioData} from 'src/@types/audio';
import AudioListItem from './AudioListItem';
import AudioListLoadingUI from './AudioListLoadingUI';
import {useSelector} from 'react-redux';
import {getPlayerState} from 'src/store/player';

interface Props {
  data: AudioData[];
  header?: string;
  visible: boolean;
  onRequestClose(): void;
  onItemPress(item: AudioData, data: AudioData[]): void;
  loading?: boolean;
}

const AudioListModal: FC<Props> = ({
  data,
  header,
  onRequestClose,
  visible,
  onItemPress,
  loading,
}) => {
  const {onGoingAudio} = useSelector(getPlayerState);
  return (
    <AppModal visible={visible} onRequestClose={onRequestClose}>
      <View style={styles.container}>
        {loading ? (
          <AudioListLoadingUI />
        ) : (
          <>
            <Text style={styles.header}>{header}</Text>
            <FlatList
              data={data}
              keyExtractor={(item, index) => item.id || index.toString()}
              renderItem={({item}) => {
                return (
                  <AudioListItem
                    onPress={() => onItemPress(item, data)}
                    audio={item}
                    isPlaying={onGoingAudio?.id === item.id}
                  />
                );
              }}
            />
          </>
        )}
      </View>
    </AppModal>
  );
};

export default AudioListModal;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  header: {
    fontSize: 18,
    color: colors.CONTRAST,
    fontWeight: 'bold',
    paddingVertical: 10,
  },
});
