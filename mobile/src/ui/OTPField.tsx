import colors from '@utils/colors';
import React, {FC, forwardRef} from 'react';
import {StyleSheet, TextInput, TextInputProps} from 'react-native';

interface Props extends TextInputProps {
  ref: any;
}

const OTPField: FC<Props> = forwardRef<TextInput, Props>((props, ref) => {
  return (
    <TextInput
      {...props}
      ref={ref}
      style={[styles.input, props.style]}
      placeholderTextColor={colors.INACTIVE_CONTRAST}
    />
  );
});

export default OTPField;

const styles = StyleSheet.create({
  input: {
    width: 50,
    height: 50,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.SECONDARY,
    textAlign: 'center',
    color: colors.CONTRAST,
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 0,
  },
});
