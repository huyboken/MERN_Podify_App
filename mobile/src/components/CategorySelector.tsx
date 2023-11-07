import BasicModalContainer from '@ui/BasicModalContainer';
import colors from '@utils/colors';
import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text} from 'react-native';
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
    <BasicModalContainer visible={visible} onRequestClose={onRequestClose}>
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
                  selectedIndex === index ? 'radiobox-marked' : 'radiobox-blank'
                }
                color={colors.SECONDARY}
              />
              {renderItem(item)}
            </Pressable>
          );
        })}
      </ScrollView>
    </BasicModalContainer>
  );
};

export default CategorySelector;

const styles = StyleSheet.create({
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
