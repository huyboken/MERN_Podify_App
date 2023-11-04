import AppButton from '@ui/AppButton';
import {useFormikContext} from 'formik';
import React, {FC} from 'react';
import {StyleSheet} from 'react-native';

interface Props {
  title: string;
}

const SubmitBtn: FC<Props> = props => {
  const {handleSubmit, isSubmitting} = useFormikContext();
  const {title} = props;
  return <AppButton busy={isSubmitting} title={title} onPress={handleSubmit} />;
};

export default SubmitBtn;

const styles = StyleSheet.create({
  container: {},
});
