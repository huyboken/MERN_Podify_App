import React from 'react';
import {StyleSheet, View} from 'react-native';

interface Props<T> {
  data: T[];
  renderItem(item: T): JSX.Element;
  col?: number;
}

const GridView = <T extends any>({data, renderItem, col = 2}: Props<T>) => {
  return (
    <View style={styles.container}>
      {data?.map((item, index) => (
        <View style={{width: 100 / col + '%'}} key={index}>
          <View style={{padding: 5}}>{renderItem(item)}</View>
        </View>
      ))}
    </View>
  );
};

export default GridView;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
