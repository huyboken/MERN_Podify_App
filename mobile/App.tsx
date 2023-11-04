import {NavigationContainer} from '@react-navigation/native';
import AuthNavigator from '@src/navigation/AuthNavigator';
import React, {FC} from 'react';

interface Props {}

const App: FC<Props> = props => {
  return (
    <NavigationContainer>
      <AuthNavigator />
    </NavigationContainer>
  );
};

export default App;
