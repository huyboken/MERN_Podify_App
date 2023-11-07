import AppContainer from '@components/AppContainer';
import AppNavigator from '@src/navigation';
import store from '@src/store';
import React, {FC} from 'react';
import {QueryClient, QueryClientProvider} from 'react-query';
import {Provider} from 'react-redux';

const queryClient = new QueryClient();

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppContainer>
          <AppNavigator />
        </AppContainer>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
