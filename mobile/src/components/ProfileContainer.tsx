import {UserProfile} from '@src/store/auth';
import AvatarField from '@ui/AvatarField';
import colors from '@utils/colors';
import React, {FC} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {ProfileNavigatorParamsList} from '@src/@type/navigation';

interface Props {
  profile?: UserProfile | null;
}

const ProfileContainer: FC<Props> = ({profile}) => {
  const navigation =
    useNavigation<NavigationProp<ProfileNavigatorParamsList>>();
  if (!profile) return null;
  return (
    <View style={styles.container}>
      <AvatarField source={profile.avatar} />
      <View style={styles.profileInfoContainer}>
        <Text style={styles.profileName}>{profile.name}</Text>
        <View style={styles.flexRow}>
          <Text style={styles.email}>{profile.email}</Text>
          {profile.verified ? (
            <MaterialIcons color={colors.SECONDARY} name="verified" size={15} />
          ) : (
            <Octicons color={colors.SECONDARY} name="unverified" size={15} />
          )}
        </View>
        <View style={styles.flexRow}>
          <Text style={styles.profileActionLink}>
            {profile.followers} Followers
          </Text>
          <Text style={styles.profileActionLink}>
            {profile.followings} Following
          </Text>
        </View>
      </View>
      <Pressable
        onPress={() => navigation.navigate('ProfileSettings')}
        style={styles.settingsBtn}>
        <AntDesign name="setting" size={22} color={colors.CONTRAST} />
      </Pressable>
    </View>
  );
};

export default ProfileContainer;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfoContainer: {
    marginLeft: 10,
  },
  profileName: {
    color: colors.CONTRAST,
    fontSize: 18,
    fontWeight: '700',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  email: {
    color: colors.CONTRAST,
    marginRight: 5,
  },
  profileActionLink: {
    backgroundColor: colors.SECONDARY,
    color: colors.PRIMARY,
    paddingHorizontal: 4,
    paddingVertical: 2,
    margin: 5,
  },
  settingsBtn: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
