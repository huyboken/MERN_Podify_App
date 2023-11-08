import BasicModalContainer from '@ui/BasicModalContainer';
import colors from '@utils/colors';
import React, {FC, useState} from 'react';
import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export interface PlaylistInfo {
  title: string;
  private: boolean;
}

interface Props {
  visible: boolean;
  onRequestClose(): void;
  onSubmit(value: PlaylistInfo): void;
}

const PlaylistForm: FC<Props> = ({visible, onRequestClose, onSubmit}) => {
  const [playlistInfo, setPlaylistInfo] = useState<PlaylistInfo>({
    title: '',
    private: false,
  });

  const handleSubmit = () => {
    onSubmit(playlistInfo);
    handleClose();
  };

  const handleClose = () => {
    setPlaylistInfo({title: '', private: false});
    onRequestClose();
  };

  return (
    <BasicModalContainer visible={visible} onRequestClose={handleClose}>
      <View>
        <Text style={styles.title}>Create New Playlist</Text>
        <TextInput
          onChangeText={text => setPlaylistInfo({...playlistInfo, title: text})}
          style={styles.input}
          placeholder="Title"
          value={playlistInfo.title}
        />
        <Pressable
          onPress={() =>
            setPlaylistInfo({...playlistInfo, private: !playlistInfo.private})
          }
          style={styles.privateSelector}>
          <MaterialCommunityIcons
            name={playlistInfo.private ? 'radiobox-marked' : 'radiobox-blank'}
            color={colors.PRIMARY}
          />
          <Text style={styles.privateLabel}>Private</Text>
        </Pressable>
        <Pressable onPress={handleSubmit} style={styles.btnSubmit}>
          <Text>Create</Text>
        </Pressable>
      </View>
    </BasicModalContainer>
  );
};

export default PlaylistForm;

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    color: colors.PRIMARY,
    fontWeight: '700',
  },
  input: {
    height: 45,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: colors.PRIMARY,
    color: colors.PRIMARY,
  },
  privateSelector: {
    height: 45,
    alignItems: 'center',
    flexDirection: 'row',
  },
  privateLabel: {
    color: colors.PRIMARY,
    marginLeft: 5,
  },
  btnSubmit: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: colors.PRIMARY,
    borderRadius: 7,
  },
});
