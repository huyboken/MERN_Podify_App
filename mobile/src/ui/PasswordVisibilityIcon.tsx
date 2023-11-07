import colors from '@utils/colors';
import React, {FC} from 'react';
import Entypo from 'react-native-vector-icons/Entypo';

interface Props {
  privateIcon: boolean;
}

const PasswordVisibilityIcon: FC<Props> = ({privateIcon}) => {
  return (
    <Entypo
      name={privateIcon ? 'eye' : 'eye-with-line'}
      color={colors.SECONDARY}
      size={16}
    />
  );
};

export default PasswordVisibilityIcon;
