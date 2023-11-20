import {NavigationProp, useNavigation} from '@react-navigation/native';
import {ProfileNavigatorParamsList} from 'src/@types/navigation';
import catchAsyncError from 'src/api/catchError';
import {getClient} from 'src/api/client';
import {getAuthState} from 'src/store/auth';
import {updateNotification} from 'src/store/notification';
import AppLink from '@ui/AppLink';
import colors from '@utils/colors';
import React, {FC, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

interface Props {
  time?: number;
  activeAtFirst?: boolean;
  linkTitle: string;
  userId?: string;
}

const ReVerificationLink: FC<Props> = ({
  time = 60,
  activeAtFirst = false,
  linkTitle,
  userId,
}) => {
  const dispatch = useDispatch();
  const {navigate} =
    useNavigation<NavigationProp<ProfileNavigatorParamsList>>();
  const {profile} = useSelector(getAuthState);

  const [countDown, setCountDown] = useState(time);
  const [canSendNewOtpRequest, setCanSendNewOtpRequest] =
    useState(activeAtFirst);

  const requestForOTP = async () => {
    setCountDown(60);
    setCanSendNewOtpRequest(false);
    try {
      const client = await getClient();
      await client.post('/auth/re-verify-email', {
        userId: userId || profile?.id,
      });
      navigate('Verification', {
        userInfo: {
          id: userId || profile?.id || '',
          name: profile?.name || '',
          email: profile?.email || '',
        },
      });
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(updateNotification({type: 'error', message: errorMessage}));
    }
  };

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
    <View style={styles.container}>
      {countDown > 0 && !canSendNewOtpRequest && (
        <Text style={styles.countDown}>{countDown} sec</Text>
      )}
      <AppLink
        active={canSendNewOtpRequest}
        title={linkTitle}
        onPress={requestForOTP}
      />
    </View>
  );
};

export default ReVerificationLink;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  countDown: {
    color: colors.SECONDARY,
    marginRight: 7,
  },
});
