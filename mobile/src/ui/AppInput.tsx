import colors from '@utils/colors';
import React, {FC} from 'react';
import {StyleSheet, TextInput, TextInputProps, View} from 'react-native';

interface Props extends TextInputProps {}

const AppInput: FC<Props> = props => {
  return (
    <TextInput
      {...props}
      style={[styles.input, props.style]}
      placeholderTextColor={colors.INACTIVE_CONTRAST}
    />
  );
};

export default AppInput;

const styles = StyleSheet.create({
  container: {},
  input: {
    borderWidth: 2,
    borderColor: colors.SECONDARY,
    height: 45,
    borderRadius: 15,
    padding: 10,
    color: colors.CONTRAST,
  },
});
