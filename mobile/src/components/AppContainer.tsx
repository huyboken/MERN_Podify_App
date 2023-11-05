import React, {FC, ReactNode} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';

interface Props {
  children: ReactNode;
}

const AppContainer: FC<Props> = ({children}) => {
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
};

export default AppContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
