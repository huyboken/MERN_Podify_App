import AuthInputField from '@components/form/AuthInputField';
import Form from '@components/form';
import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import * as yup from 'yup';
import SubmitBtn from '@components/form/SubmitBtn';
import AppLink from '@ui/AppLink';
import AuthFormContainer from '@components/AuthFromContainer';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {AuthStackParamList} from '@src/@type/navigation';
import {FormikHelpers} from 'formik';
import client from '@src/api/client';
import catchAsyncError from '@src/api/catchError';
import {updateNotification} from '@src/store/notification';
import {useDispatch} from 'react-redux';

const lostPasswordSchema = yup.object({
  email: yup
    .string()
    .trim('Email is mising!')
    .email('Invalid email!')
    .required('Email is required!'),
});

interface Props {}

interface InitialValue {
  email: string;
}

const initialValues = {
  email: '',
};

const LostPassword: FC<Props> = props => {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  const handleSubmit = async (
    values: InitialValue,
    action: FormikHelpers<InitialValue>,
  ) => {
    action.setSubmitting(true);
    try {
      const {data} = await client.post('/auth/forget-password', {
        ...values,
      });

      console.log(data);
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
      validationSchema={lostPasswordSchema}>
      <AuthFormContainer
        heading="Forget Password!"
        subHeading="Oops, did you forget your password? Don't worry, we'll help you get back in.">
        <View style={styles.formContainer}>
          <AuthInputField
            name="email"
            label="Email"
            placeholder="Jonndoe@gmail.com"
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.marginBottom}
          />
          <SubmitBtn title="Send link" />

          <View style={styles.linkContainer}>
            <AppLink
              title="Sign In"
              onPress={() => navigation.navigate('SignIn')}
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

export default LostPassword;

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
