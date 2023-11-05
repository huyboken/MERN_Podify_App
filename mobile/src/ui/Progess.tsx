import colors from '@utils/colors';
import React, {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface Props {
  progress: number;
}

const Progess: FC<Props> = ({progress}) => {
  return (
    <>
      <Text style={styles.title}>{progress}%</Text>
      <View style={[styles.progressBar, {width: `${progress}%`}]} />
    </>
  );
};

export default Progess;

const styles = StyleSheet.create({
  title: {
    color: colors.CONTRAST,
    paddingVertical: 2,
    alignSelf: 'flex-end',
  },
  progressBar: {
    height: 10,
    backgroundColor: colors.CONTRAST,
    borderRadius: 5,
  },
});
