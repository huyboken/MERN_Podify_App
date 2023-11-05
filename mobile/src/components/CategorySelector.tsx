import colors from '@utils/colors';
import React, {useState} from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props<T> {
  data: T[];
  visible?: boolean;
  title?: string;
  renderItem(item: T): JSX.Element;
  onSelect(item: T, index: number): void;
  onRequestClose?(): void;
}

const CategorySelector = <T extends any>({
  visible = false,
  title,
  data = [],
  renderItem,
  onSelect,
  onRequestClose,
}: Props<T>) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelector = (item: T, index: number) => () => {
    setSelectedIndex(index);
    onSelect(item, index);
    onRequestClose && onRequestClose();
  };

  return (
    <Modal
      onRequestClose={onRequestClose}
      visible={visible}
      transparent
      animationType="fade">
      <View style={styles.modalContainer}>
        <Pressable onPress={onRequestClose} style={styles.backdrop} />
        <View style={styles.modal}>
          <Text style={styles.title}>{title}</Text>
          <ScrollView>
            {data.map((item, index) => {
              return (
                <Pressable
                  onPress={handleSelector(item, index)}
                  key={index}
                  style={styles.selectorContainer}>
                  <MaterialCommunityIcons
                    name={
                      selectedIndex === index
                        ? 'radiobox-marked'
                        : 'radiobox-blank'
                    }
                    color={colors.SECONDARY}
                  />
                  {renderItem(item)}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default CategorySelector;

const styles = StyleSheet.create({
  container: {},
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.OVERLAY,
    zIndex: -1,
  },
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
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.PRIMARY,
    paddingVertical: 10,
  },
  selectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
