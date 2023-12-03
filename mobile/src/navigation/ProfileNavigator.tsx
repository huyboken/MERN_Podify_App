import ProfileSettings from '@components/profile/ProfileSettings';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ProfileNavigatorParamList} from 'src/@types/navigation';
import Profile from '@views/Profile';
import Verification from '@views/auth/Verification';
import React, {FC} from 'react';
import UpdateAudio from '@components/profile/UpdateAudio';

const Stack = createNativeStackNavigator<ProfileNavigatorParamList>();

interface Props {}

const ProfileNavigator: FC<Props> = props => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="ProfileSettings" component={ProfileSettings} />
      <Stack.Screen name="Verification" component={Verification} />
      <Stack.Screen name="UpdateAudio" component={UpdateAudio} />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
