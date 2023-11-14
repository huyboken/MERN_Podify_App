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

export type ProfileNavigatorParamsList = {
  Profile: undefined;
  ProfileSettings: undefined;
  Verification: {userInfo: NewUserResponse};
};
