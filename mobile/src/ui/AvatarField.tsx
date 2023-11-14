import colors from '@utils/colors';
import React, {FC} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

interface Props {
  source?: string;
}

const avatarSize = 70;

const AvatarField: FC<Props> = ({source}) => {
  return (
    <View style={styles.container}>
      {source ? (
        <Image source={{uri: source}} style={styles.avatarImage} />
      ) : (
        <View style={styles.avatarImage}>
          <Entypo name="mic" size={30} color={colors.PRIMARY} />
        </View>
      )}
    </View>
  );
};

export default AvatarField;

const styles = StyleSheet.create({
  container: {},
  avatarImage: {
    height: avatarSize,
    width: avatarSize,
    borderRadius: avatarSize / 2,
    backgroundColor: colors.SECONDARY,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.CONTRAST,
  },
});
