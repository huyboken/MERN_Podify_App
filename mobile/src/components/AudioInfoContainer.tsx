import AppLink from '@ui/AppLink';
import colors from '@utils/colors';
import React, {FC} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';
import {getPlayerState} from 'src/store/player';

interface Props {
  visible: boolean;
  closerHandle(state: boolean): void;
}

const AudioInfoContainer: FC<Props> = ({visible, closerHandle}) => {
  const {onGoingAudio} = useSelector(getPlayerState);
  if (!visible) return null;

  const handleClose = () => {
    closerHandle(!visible);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handleClose} style={styles.closeBtn}>
        <AntDesign name="close" color={colors.CONTRAST} size={24} />
      </Pressable>
      <ScrollView>
        <View>
          <Text style={styles.title}>{onGoingAudio?.title}</Text>
          <View style={styles.ownerInfo}>
            <Text style={styles.title}>Creator: </Text>
            <AppLink title={onGoingAudio?.owner.name || ''} />
          </View>
          <Text style={styles.about}>{onGoingAudio?.about}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default AudioInfoContainer;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.PRIMARY,
    zIndex: 1,
    padding: 10,
  },
  closeBtn: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  title: {
    fontSize: 18,
    color: colors.CONTRAST,
    paddingVertical: 5,
    fontWeight: 'bold',
  },
  about: {
    fontSize: 16,
    color: colors.CONTRAST,
    paddingVertical: 5,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creator: {},
});
