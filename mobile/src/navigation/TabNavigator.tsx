import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import colors from '@utils/colors';
import Upload from '@views/Upload';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ProfileNavigator from './ProfileNavigator';
import HomeNavigator from './HomeNavigator';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {backgroundColor: colors.PRIMARY},
      }}>
      <Tab.Screen
        name="HomeNavigator"
        component={HomeNavigator}
        options={{
          tabBarIcon: ({color, size}) => (
            <AntDesign name="home" color={color} size={size} />
          ),
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="ProfileNavigator"
        component={ProfileNavigator}
        options={{
          tabBarIcon: ({color, size}) => (
            <AntDesign name="user" color={color} size={size} />
          ),
          tabBarLabel: 'Profile',
        }}
      />
      <Tab.Screen
        name="UploadScreen"
        component={Upload}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="account-music-outline"
              color={color}
              size={size}
            />
          ),
          tabBarLabel: 'Upload',
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
