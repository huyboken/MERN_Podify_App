import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';

interface Props {}

const Home: FC<Props> = props => {
  return <View style={styles.container}></View>;
};

export default Home;

const styles = StyleSheet.create({
  container: {},
});
