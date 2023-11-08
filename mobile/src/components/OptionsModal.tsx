import BasicModalContainer from '@ui/BasicModalContainer';
import React from 'react';
import {StyleSheet, View} from 'react-native';

interface Props<T> {
  visible: boolean;
  onRequestClose(): void;
  options: T[];
  renderItem(item: T): JSX.Element;
}

const OptionsModal = <T extends any>({
  visible,
  onRequestClose,
  options,
  renderItem,
}: Props<T>) => {
  return (
    <BasicModalContainer visible={visible} onRequestClose={onRequestClose}>
      {options.map((item, index) => {
        return <View key={index}>{renderItem(item)}</View>;
      })}
    </BasicModalContainer>
  );
};

export default OptionsModal;

const styles = StyleSheet.create({
  container: {},
});
