import colors from '@utils/colors';
import React, {FC, ReactNode} from 'react';
import {Modal, Pressable, StyleSheet, View} from 'react-native';

interface Props {
  visible?: boolean;
  onRequestClose?(): void;
  children?: ReactNode;
}

const BasicModalContainer: FC<Props> = ({
  onRequestClose,
  visible,
  children,
}) => {
  return (
    <Modal
      onRequestClose={onRequestClose}
      visible={visible}
      transparent
      animationType="fade">
      <View style={styles.modalContainer}>
        <Pressable onPress={onRequestClose} style={styles.backdrop} />
        <View style={styles.modal}>{children}</View>
      </View>
    </Modal>
  );
};

export default BasicModalContainer;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  modal: {
    width: '90%',
    maxHeight: '50%',
    borderRadius: 10,
    padding: 10,
    backgroundColor: colors.CONTRAST,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.OVERLAY,
    zIndex: -1,
  },
});
