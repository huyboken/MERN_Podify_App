import {AudioData} from './audio';

interface NewUserResponse {
  id: string;
  name: string;
  email: string;
}

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  LostPassword: undefined;
  Verification: {userInfo: NewUserResponse};
};

export type ProfileNavigatorParamList = {
  Profile: undefined;
  ProfileSettings: undefined;
  UpdateAudio: {audio: AudioData};
  Verification: {userInfo: NewUserResponse};
};

export type HomeNavigatorParamList = {
  Home: undefined;
  PublicProfile: {profileId: string};
  ProfileNavigator: {
    screens: 'Profile';
  };
};

export type PublicProfileTabParamsList = {
  PublicUploads: {profileId: string};
  PublicPlaylist: {profileId: string};
};
