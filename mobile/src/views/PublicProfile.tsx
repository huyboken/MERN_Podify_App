import AppView from '@components/AppView';
import PublicPlaylistTab from '@components/profile/PublicPlaylistTab';
import PublicProfileContainer from '@components/profile/PublicProfileContainer';
import PublicUploadsTab from '@components/profile/PublicUploadsTab';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import colors from '@utils/colors';
import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  HomeNavigatorParamList,
  PublicProfileTabParamsList,
} from 'src/@types/navigation';
import {useFetchPublicProfile} from 'src/hooks/query';

type Props = NativeStackScreenProps<HomeNavigatorParamList, 'PublicProfile'>;

const Tab = createMaterialTopTabNavigator<PublicProfileTabParamsList>();

const PublicProfile: FC<Props> = ({route}) => {
  const {profileId} = route.params;
  const {data} = useFetchPublicProfile(profileId);

  return (
    <AppView>
      <View style={styles.container}>
        <PublicProfileContainer profile={data} />
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: styles.tabBarStyle,
            tabBarLabelStyle: styles.tabBarLabelStyle,
          }}>
          <Tab.Screen
            name="PublicUploads"
            component={PublicUploadsTab}
            options={{tabBarLabel: 'Uploads'}}
            initialParams={{profileId}}
          />
          <Tab.Screen
            name="PublicPlaylist"
            component={PublicPlaylistTab}
            options={{tabBarLabel: 'Playlist'}}
            initialParams={{profileId}}
          />
        </Tab.Navigator>
      </View>
    </AppView>
  );
};

export default PublicProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  tabBarStyle: {
    marginBottom: 20,
    backgroundColor: 'transparent',
    elevation: 0,
    shadowRadius: 0,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowOffset: {height: 0, width: 0},
  },
  tabBarLabelStyle: {
    color: colors.CONTRAST,
    fontSize: 12,
  },
});
