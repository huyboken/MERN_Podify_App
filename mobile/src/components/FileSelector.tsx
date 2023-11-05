import colors from '@utils/colors';
import React, {FC, ReactNode} from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import DocumentPicker, {
  DocumentPickerOptions,
  DocumentPickerResponse,
} from 'react-native-document-picker';
import {SupportedPlatforms} from 'react-native-document-picker/lib/typescript/fileTypes';

interface Props {
  icon?: ReactNode;
  btnTitle?: string;
  style?: StyleProp<ViewStyle>;
  onSelect(file: DocumentPickerResponse): void;
  options: DocumentPickerOptions<SupportedPlatforms>;
}

const FileSelector: FC<Props> = ({
  icon,
  btnTitle,
  style,
  onSelect,
  options,
}) => {
  const handleDocumentSelector = async () => {
    try {
      const document = await DocumentPicker.pick(options);
      const file = document[0];
      onSelect(file);
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.log(error);
      }
    }
  };
  return (
    <Pressable
      onPress={handleDocumentSelector}
      style={[styles.btnContainer, style]}>
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={styles.btnTitle}>{btnTitle}</Text>
    </Pressable>
  );
};

export default FileSelector;

const styles = StyleSheet.create({
  btnContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    height: 70,
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: colors.SECONDARY,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTitle: {
    color: colors.CONTRAST,
    marginTop: 5,
  },
});
