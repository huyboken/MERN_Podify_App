import React, {FC, useEffect, useRef, useState} from 'react';
import {Keyboard, StyleSheet, Text, TextInput, View} from 'react-native';
import AppLink from '@ui/AppLink';
import AuthFormContainer from '@components/AuthFromContainer';
import OTPField from '@ui/OTPField';
import AppButton from '@ui/AppButton';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  AuthStackParamList,
  ProfileNavigatorParamsList,
} from '@src/@type/navigation';
import client from '@src/api/client';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import colors from '@utils/colors';
import catchAsyncError from '@src/api/catchError';
import {updateNotification} from '@src/store/notification';
import {useDispatch} from 'react-redux';
import ReVerificationLink from '@components/ReVerificationLink';

type Props = NativeStackScreenProps<
  AuthStackParamList | ProfileNavigatorParamsList,
  'Verification'
>;

type PossibleScreens = {
  ProfileSettings: undefined;
  SignIn: undefined;
};

const otpFields = new Array(6).fill('');

const Verification: FC<Props> = ({route}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<PossibleScreens>>();
  const [otp, setOtp] = useState([...otpFields]);
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  const [submiting, setSubmiting] = useState(false);

  const {userInfo} = route.params;

  const inputRef = useRef<TextInput>(null);

  const handleChange = (value: string, index: number) => {
    const newOpt = [...otp];
    if (value === 'Backspace') {
      //Moves to the previous only if the field is empty
      if (!newOpt[index]) setActiveOtpIndex(index - 1);
      newOpt[index] = '';
    } else {
      //update otp and move to the next
      setActiveOtpIndex(index + 1);
      newOpt[index] = value;
    }
    setOtp([...newOpt]);
  };

  const handlePaste = (value: string) => {
    if (value.length === 6) {
      Keyboard.dismiss();
      const newOtp = value.split('');
      setOtp([...newOtp]);
    }
  };

  const isValidOtp = otp.every(value => value.trim());

  const handleSubmit = async () => {
    if (!isValidOtp)
      return dispatch(
        updateNotification({type: 'error', message: 'Invalid OTP!'}),
      );
    setSubmiting(true);
    try {
      const {data} = await client.post('/auth/verify-email', {
        userId: userInfo.id,
        token: otp.join(''),
      });
      dispatch(updateNotification({type: 'success', message: data.message}));

      const {routeNames} = navigation.getState();
      if (routeNames.includes('SignIn')) {
        //Navigation back to sign in
        navigation.navigate('SignIn');
      }
      if (routeNames.includes('ProfileSettings')) {
        //Navigation back to ProfileSettings
        navigation.navigate('ProfileSettings');
      }
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(updateNotification({type: 'error', message: errorMessage}));
    }
    setSubmiting(false);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  return (
    <AuthFormContainer heading="Please look at your email!">
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          {otpFields.map((_, index) => {
            return (
              <OTPField
                ref={activeOtpIndex === index ? inputRef : null}
                key={index}
                placeholder="*"
                onKeyPress={({nativeEvent}) =>
                  handleChange(nativeEvent.key, index)
                }
                onChangeText={handlePaste}
                keyboardType="numeric"
                value={otp[index] || ''}
              />
            );
          })}
        </View>

        <AppButton busy={submiting} title="Send link" onPress={handleSubmit} />

        <View style={styles.linkContainer}>
          {/* {countDown > 0 && (
            <Text style={styles.countDown}>{countDown} sec</Text>
          )}
          <AppLink
            active={canSendNewOtpRequest}
            title="Re-send OTP"
            onPress={requestForOTP}
          /> */}
          <ReVerificationLink linkTitle="Re-send OTP" userId={userInfo.id} />
        </View>
      </View>
    </AuthFormContainer>
  );
};

export default Verification;

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  linkContainer: {
    justifyContent: 'flex-end',
    marginTop: 20,
    width: '100%',
  },
  countDown: {
    color: colors.SECONDARY,
    marginRight: 7,
  },
});
