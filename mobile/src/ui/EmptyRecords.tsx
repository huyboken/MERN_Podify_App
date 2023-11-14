import colors from '@utils/colors';
import React, {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface Props {
  title: string;
}

const EmptyRecords: FC<Props> = ({title}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default EmptyRecords;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: colors.INACTIVE_CONTRAST,
  },
});
