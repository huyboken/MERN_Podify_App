import React, {FC, ReactNode} from 'react';
import {StyleSheet, View} from 'react-native';
import MiniAudioPlayer from './MiniAudioPlayer';
import useAudioController from 'src/hooks/useAudioController';

interface Props {
  children: ReactNode;
}

const AppView: FC<Props> = ({children}) => {
  const {isPlayerReady} = useAudioController();

  return (
    <View style={styles.container}>
      <View style={styles.children}>{children}</View>
      {isPlayerReady ? <MiniAudioPlayer /> : null}
    </View>
  );
};

export default AppView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  children: {
    flex: 1,
  },
});
