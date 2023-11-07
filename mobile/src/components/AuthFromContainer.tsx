import CircleUi from '@ui/CircleUi';
import colors from '@utils/colors';
import React, {FC, ReactNode} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

interface Props {
  heading?: string;
  subHeading?: string;
  children: ReactNode;
}

const AuthFormContainer: FC<Props> = ({heading, subHeading, children}) => {
  return (
    <View style={styles.container}>
      <CircleUi position="top-left" size={200} />
      <CircleUi position="top-right" size={100} />
      <CircleUi position="bottom-left" size={100} />
      <CircleUi position="bottom-right" size={200} />
      <View style={styles.headingContainer}>
        <Image source={require('../assets/logo.png')} />
        <Text style={styles.heading}>{heading}</Text>
        <Text style={styles.subHeading}>{subHeading}</Text>
      </View>
      {children}
    </View>
  );
};

export default AuthFormContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  headingContainer: {
    width: '100%',
    marginBottom: 20,
  },
  heading: {
    color: colors.SECONDARY,
    fontSize: 25,
    fontWeight: 'bold',
    paddingVertical: 5,
  },
  subHeading: {
    color: colors.CONTRAST,
    fontSize: 16,
  },
});
