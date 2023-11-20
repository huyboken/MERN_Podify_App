import BasicModalContainer from '@ui/BasicModalContainer';
import colors from '@utils/colors';
import React, {FC, ReactNode} from 'react';
import {Pressable, ScrollView, StyleSheet, Text} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Playlist} from 'src/@types/audio';

interface Props {
  visible: boolean;
  onRequestClose?(): void;
  list: Playlist[];
  onCreateNewPress(): void;
  onPlaylistPress(item: Playlist): void;
}

interface ListItemProps {
  title: string;
  icon: ReactNode;
  onPress?(): void;
}

const ListItem: FC<ListItemProps> = ({title, icon, onPress}) => {
  return (
    <Pressable onPress={onPress} style={styles.listItemContainer}>
      {icon}
      <Text style={styles.listItemTitle}>{title}</Text>
    </Pressable>
  );
};

const PlaylistModal: FC<Props> = ({
  visible,
  onRequestClose,
  list = [],
  onCreateNewPress,
  onPlaylistPress,
}) => {
  return (
    <BasicModalContainer visible={visible} onRequestClose={onRequestClose}>
      <ScrollView>
        {list.map(item => {
          return (
            <ListItem
              onPress={() => onPlaylistPress(item)}
              key={item.id}
              icon={
                <FontAwesome
                  name={item.visibility === 'public' ? 'globe' : 'lock'}
                  color={colors.PRIMARY}
                  size={20}
                />
              }
              title={item.title}
            />
          );
        })}
      </ScrollView>

      <ListItem
        icon={<AntDesign name="plus" color={colors.PRIMARY} size={20} />}
        title="Create New"
        onPress={onCreateNewPress}
      />
    </BasicModalContainer>
  );
};

export default PlaylistModal;

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
  },
  listItemTitle: {
    fontSize: 16,
    color: colors.PRIMARY,
    marginLeft: 5,
  },
});
