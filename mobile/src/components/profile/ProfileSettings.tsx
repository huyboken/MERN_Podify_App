import AppHeader from '@components/AppHeader';
import AvatarField from '@ui/AvatarField';
import colors from '@utils/colors';
import React, {FC, useEffect, useState} from 'react';
import {
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AppButton from '@ui/AppButton';
import {getClient} from 'src/api/client';
import catchAsyncError from 'src/api/catchError';
import {useDispatch, useSelector} from 'react-redux';
import {updateNotification} from 'src/store/notification';
import {Keys, removeFromAsyncStorage} from '@utils/asyncStorage';
import {
  getAuthState,
  updateBusyState,
  updateLogginState,
  updateProfile,
} from 'src/store/auth';
import deepEqual from 'deep-equal';
import ImagePicker from 'react-native-image-crop-picker';
import {getPermissionToReadImage} from '@utils/helper';
import ReVerificationLink from '@components/ReVerificationLink';
import {useQueryClient} from 'react-query';

interface Props {}
interface ProfileInfo {
  name: string;
  avatar?: string;
}

const ProfileSettings: FC<Props> = props => {
  const dispatch = useDispatch();

  const [userInfo, setUserInfo] = useState<ProfileInfo>({name: ''});
  const [busy, setBusy] = useState(false);

  const {profile} = useSelector(getAuthState);
  const queryClient = useQueryClient();

  const isSame = deepEqual(userInfo, {
    name: profile?.name,
    avatar: profile?.avatar,
  });

  const handleLogout = async (fromAll?: boolean) => {
    dispatch(updateBusyState(true));
    try {
      const endpoint = '/auth/log-out?fromAll=' + (fromAll ? 'yes' : '');
      const client = await getClient();
      await client.post(endpoint);
      await removeFromAsyncStorage(Keys.AUTH_TOKEN);
      dispatch(updateProfile(null));
      dispatch(updateLogginState(false));
    } catch (error) {
      const messageError = catchAsyncError(error);
      dispatch(updateNotification({message: messageError, type: 'error'}));
    }
    dispatch(updateBusyState(false));
  };

  const handleSubmit = async () => {
    setBusy(true);
    try {
      if (!userInfo.name.trim())
        dispatch(
          updateNotification({
            message: 'Profile name is required!',
            type: 'error',
          }),
        );
      const formData = new FormData();
      formData.append('name', userInfo.name);
      if (userInfo.avatar)
        formData.append('avatar', {
          name: 'avatar',
          type: 'image/jpeg',
          uri: userInfo.avatar,
        });
      const client = await getClient({'Content-Type': 'multipart/form-data;'});
      const {data} = await client.post('/auth/update-profile', formData);
      dispatch(updateProfile(data.profile));
      dispatch(
        updateNotification({
          message: 'Your profile is updated.',
          type: 'success',
        }),
      );
      Keyboard.dismiss();
    } catch (error) {
      const messageError = catchAsyncError(error);
      dispatch(updateNotification({message: messageError, type: 'error'}));
    }
    setBusy(false);
  };

  const handleImageSelect = async () => {
    try {
      await getPermissionToReadImage();
      const {path} = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
      });
      setUserInfo({...userInfo, avatar: path});
    } catch (error) {
      console.log(error);
    }
  };

  const clearHistory = async () => {
    try {
      const client = await getClient();
      await client.delete('/history?all=yes');
      dispatch(
        updateNotification({
          type: 'success',
          message: 'Your histories will be removed!',
        }),
      );
      queryClient.invalidateQueries({queryKey: ['histories']});
    } catch (error) {
      const messageError = catchAsyncError(error);
      dispatch(updateNotification({type: 'error', message: messageError}));
    }
  };

  const handleOnHistoryClear = () => {
    Alert.alert(
      'Are you sure?',
      'This action will clear out all the history!',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: clearHistory,
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  useEffect(() => {
    if (profile) setUserInfo({name: profile.name, avatar: profile.avatar});
  }, [profile]);

  return (
    <View style={styles.container}>
      <AppHeader title="Settings" />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Profile Settings</Text>
      </View>
      <View style={styles.settingOptionsContainer}>
        <View style={styles.avatarContainer}>
          <AvatarField source={userInfo?.avatar} />
          <Pressable style={styles.paddingLeft} onPress={handleImageSelect}>
            <Text style={styles.linkText}>Update Profile Image</Text>
          </Pressable>
        </View>
        <TextInput
          onChangeText={text => setUserInfo({...userInfo, name: text})}
          style={styles.nameInput}
          value={userInfo?.name}
        />
        <View style={styles.emailContainer}>
          <Text style={styles.email}>{profile?.email}</Text>
          {profile?.verified ? (
            <MaterialIcons color={colors.SECONDARY} name="verified" size={15} />
          ) : (
            <ReVerificationLink linkTitle="Verify" activeAtFirst />
          )}
        </View>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>History</Text>
      </View>

      <View style={styles.settingOptionsContainer}>
        <Pressable
          style={styles.buttonContainer}
          onPress={handleOnHistoryClear}>
          <MaterialCommunityIcons
            name="broom"
            size={20}
            color={colors.CONTRAST}
          />
          <Text style={styles.buttonTitle}>Clear All</Text>
        </Pressable>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Logout</Text>
      </View>

      <View style={styles.settingOptionsContainer}>
        <Pressable
          style={styles.buttonContainer}
          onPress={() => handleLogout(true)}>
          <AntDesign name="logout" size={20} color={colors.CONTRAST} />
          <Text style={styles.buttonTitle}>Logout From All</Text>
        </Pressable>
        <Pressable
          style={styles.buttonContainer}
          onPress={() => handleLogout()}>
          <AntDesign name="logout" size={20} color={colors.CONTRAST} />
          <Text style={styles.buttonTitle}>Logout</Text>
        </Pressable>
      </View>
      {!isSame && (
        <View style={styles.marginTop}>
          <AppButton
            title="Update"
            onPress={handleSubmit}
            busy={busy}
            borderRadius={7}
          />
        </View>
      )}
    </View>
  );
};

export default ProfileSettings;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  titleContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.SECONDARY,
    paddingBottom: 5,
    marginTop: 15,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: colors.SECONDARY,
  },
  settingOptionsContainer: {
    marginTop: 15,
    paddingLeft: 15,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    color: colors.SECONDARY,
    fontStyle: 'italic',
  },
  paddingLeft: {
    paddingLeft: 15,
  },
  nameInput: {
    color: colors.CONTRAST,
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
    borderRadius: 7,
    borderWidth: 0.5,
    borderColor: colors.CONTRAST,
    marginTop: 15,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  email: {
    color: colors.CONTRAST,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  buttonTitle: {
    color: colors.CONTRAST,
    fontSize: 18,
    marginLeft: 5,
  },
  marginTop: {
    marginTop: 15,
  },
});
