import React, {FC, useEffect, useRef, useState} from 'react';
import {Keyboard, StyleSheet, Text, TextInput, View} from 'react-native';
import AppLink from '@ui/AppLink';
import AuthFormContainer from '@components/AuthFromContainer';
import OTPField from '@ui/OTPField';
import AppButton from '@ui/AppButton';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@src/@type/navigation';
import client from '@src/api/client';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import colors from '@utils/colors';

type Props = NativeStackScreenProps<AuthStackParamList, 'Verification'>;

const otpFields = new Array(6).fill('');

const Verification: FC<Props> = ({route}) => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const [otp, setOtp] = useState([...otpFields]);
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  const [submiting, setSubmiting] = useState(false);
  const [countDown, setCountDown] = useState(60);
  const [canSendNewOtpRequest, setCanSendNewOtpRequest] = useState(false);

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
    if (!isValidOtp) return;
    setSubmiting(true);
    try {
      const {data} = await client.post('/auth/verify-email', {
        userId: userInfo.id,
        token: otp.join(''),
      });
      //Navigation back to sign in
      navigation.navigate('SignIn');
    } catch (error) {
      console.log('Error inside Verification: ', error);
    }
    setSubmiting(false);
  };

  const requestForOTP = async () => {
    setCountDown(60);
    setCanSendNewOtpRequest(false);
    try {
      await client.post('/auth/re-verify-email', {userId: userInfo.id});
    } catch (error) {
      console.log('Requesting for new otp: ', error);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  useEffect(() => {
    if (canSendNewOtpRequest) return;
    const intervalId = setInterval(() => {
      setCountDown(oldCountDown => {
        if (oldCountDown <= 0) {
          setCanSendNewOtpRequest(true);
          clearInterval(intervalId);
          return 0;
        }
        return oldCountDown - 1;
      });
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [canSendNewOtpRequest]);

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
          {countDown > 0 && (
            <Text style={styles.countDown}>{countDown} sec</Text>
          )}
          <AppLink
            active={canSendNewOtpRequest}
            title="Re-send OTP"
            onPress={requestForOTP}
          />
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
    flexDirection: 'row',
  },
  countDown: {
    color: colors.SECONDARY,
    marginRight: 7,
  },
});
