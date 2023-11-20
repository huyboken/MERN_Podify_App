import ProfileSettings from '@components/profile/ProfileSettings';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ProfileNavigatorParamsList} from 'src/@types/navigation';
import Profile from '@views/Profile';
import Verification from '@views/auth/Verification';
import React, {FC} from 'react';

const Stack = createNativeStackNavigator<ProfileNavigatorParamsList>();

interface Props {}

const ProfileNavigator: FC<Props> = props => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="ProfileSettings" component={ProfileSettings} />
      <Stack.Screen name="Verification" component={Verification} />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
