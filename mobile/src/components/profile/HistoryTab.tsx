import React, {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface Props {}

const HistoryTab: FC<Props> = props => {
  return (
    <View style={styles.container}>
      <Text>HistoryTab</Text>
    </View>
  );
};

export default HistoryTab;

const styles = StyleSheet.create({
  container: {},
});
