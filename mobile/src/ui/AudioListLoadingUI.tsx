import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import PulseAnimationContainer from './PulseAnimationContainer';
import colors from '@utils/colors';

interface Props {
  items?: number;
}

const AudioListLoadingUI: FC<Props> = ({items = 10}) => {
  const dummyData = new Array(items).fill('');
  return (
    <PulseAnimationContainer>
      <View>
        {dummyData.map((_, index) => {
          return <View key={index} style={styles.dummyListItem} />;
        })}
      </View>
    </PulseAnimationContainer>
  );
};

export default AudioListLoadingUI;

const styles = StyleSheet.create({
  dummyListItem: {
    height: 50,
    width: '100%',
    backgroundColor: colors.INACTIVE_CONTRAST,
    borderRadius: 5,
    marginTop: 10,
  },
});
