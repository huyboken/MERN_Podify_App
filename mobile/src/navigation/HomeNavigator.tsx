import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeNavigatorParamList} from 'src/@types/navigation';
import React, {FC} from 'react';

import Home from '@views/Home';
import PublicProfile from '@views/PublicProfile';

const Stack = createNativeStackNavigator<HomeNavigatorParamList>();

interface Props {}

const HomeNavigator: FC<Props> = props => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="PublicProfile" component={PublicProfile} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
