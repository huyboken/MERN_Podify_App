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
import {isAxiosError} from 'axios';
import {useDispatch} from 'react-redux';
import {updateNotification} from '@src/store/notification';
import catchAsyncError from '@src/api/catchError';

const signupSchema = yup.object({
  name: yup
    .string()
    .trim('Name is mising!')
    .min(3, 'Invalid name!')
    .required('Name is required!'),
  email: yup
    .string()
    .trim('Email is mising!')
    .email('Invalid email!')
    .required('Email is required!'),
  password: yup
    .string()
    .trim('Password is mising!')
    .min(8, 'Password is too short!')
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
      'Password is too simple!',
    )
    .required('Password is required!'),
});

interface Props {}

interface NewUser {
  name: string;
  email: string;
  password: string;
}

const initialValues = {
  name: '',
  email: '',
  password: '',
};

const SignUp: FC<Props> = props => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const dispatch = useDispatch();

  const [secureEntry, setSecureEntry] = useState(true);

  const tooglePasswordView = () => setSecureEntry(!secureEntry);

  const handleSubmit = async (
    values: NewUser,
    action: FormikHelpers<NewUser>,
  ) => {
    action.setSubmitting(true);
    try {
      const {data} = await client.post('/auth/create', {
        ...values,
      });
      navigation.navigate('Verification', {userInfo: data.user});
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(updateNotification({type: 'error', message: errorMessage}));
    }
    action.setSubmitting(false);
  };

  return (
    <Form
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={signupSchema}>
      <AuthFormContainer
        heading="Welcome!"
        subHeading="Let's get started by creating your account.">
        <View style={styles.formContainer}>
          <AuthInputField
            name="name"
            label="Name"
            placeholder="Jonn Doe"
            containerStyle={styles.marginBottom}
          />
          <AuthInputField
            name="email"
            label="Email"
            placeholder="Jonndoe@gmail.com"
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
          <SubmitBtn title="Sign Up" />

          <View style={styles.linkContainer}>
            <AppLink
              title="I Lost My Password"
              onPress={() => navigation.navigate('LostPassword')}
            />
            <AppLink
              title="Sign In"
              onPress={() => navigation.navigate('SignIn')}
            />
          </View>
        </View>
      </AuthFormContainer>
    </Form>
  );
};

export default SignUp;

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
