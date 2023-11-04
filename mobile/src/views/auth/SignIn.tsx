import AuthInputField from '@components/form/AuthInputField';
import Form from '@components/form';
import React, {FC, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import * as yup from 'yup';
import SubmitBtn from '@components/form/SubmitBtn';
import PasswordVisibilityIcon from '@ui/PasswordVisibilityIcon';
import AppLink from '@ui/AppLink';
import AuthFormContainer from '@components/AuthFromContainer';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {AuthStackParamList} from '@src/@type/navigation';
import {FormikHelpers} from 'formik';
import client from '@src/api/client';

const signinSchema = yup.object({
  email: yup
    .string()
    .trim('Email is mising!')
    .email('Invalid email!')
    .required('Email is required!'),
  password: yup
    .string()
    .trim('Password is mising!')
    .min(8, 'Password is too short!')
    .required('Password is required!'),
});

interface Props {}

interface SignInUserInfo {
  email: string;
  password: string;
}

const initialValues = {
  email: '',
  password: '',
};

const SignIn: FC<Props> = props => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  const [secureEntry, setSecureEntry] = useState(true);

  const tooglePasswordView = () => setSecureEntry(!secureEntry);

  const handleSubmit = async (
    values: SignInUserInfo,
    action: FormikHelpers<SignInUserInfo>,
  ) => {
    action.setSubmitting(true);
    try {
      const {data} = await client.post('/auth/sign-in', {
        ...values,
      });
      // navigation.navigate('Verification', {userInfo: data.user});
      console.log(data);
    } catch (error) {
      console.log('Sign in error: ', JSON.stringify(error));
    }
    action.setSubmitting(false);
  };

  return (
    <Form
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={signinSchema}>
      <AuthFormContainer heading="Welcome back!">
        <View style={styles.formContainer}>
          <AuthInputField
            name="email"
            label="Email"
            placeholder="JohnDoe@gmail.com"
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.marginBottom}
          />
          <AuthInputField
            name="password"
            label="Password"
            placeholder="********"
            autoCapitalize="none"
            secureTextEntry={secureEntry}
            containerStyle={styles.marginBottom}
            rightIcon={<PasswordVisibilityIcon privateIcon={secureEntry} />}
            onRightIconPress={tooglePasswordView}
          />
          <SubmitBtn title="Sign In" />

          <View style={styles.linkContainer}>
            <AppLink
              title="I Lost My Password"
              onPress={() => navigation.navigate('LostPassword')}
            />
            <AppLink
              title="Sign Up"
              onPress={() => navigation.navigate('SignUp')}
            />
          </View>
        </View>
      </AuthFormContainer>
    </Form>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
  },
  marginBottom: {
    marginBottom: 20,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
});
