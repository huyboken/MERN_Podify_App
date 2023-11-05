import AppContainer from '@components/AppContainer';
import AppNavigator from '@src/navigation';
import store from '@src/store';
import React, {FC} from 'react';
import {Provider} from 'react-redux';

const App = () => {
  return (
    <Provider store={store}>
      <AppContainer>
        <AppNavigator />
      </AppContainer>
    </Provider>
  );
};

export default App;
