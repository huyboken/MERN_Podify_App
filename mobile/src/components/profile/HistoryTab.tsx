import {useNavigation} from '@react-navigation/native';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyRecords from '@ui/EmptyRecords';
import colors from '@utils/colors';
import React, {FC, useEffect, useState} from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useMutation, useQueryClient} from 'react-query';
import {useDispatch} from 'react-redux';
import {History, HistoryAudio} from 'src/@types/audio';
import catchAsyncError from 'src/api/catchError';
import {getClient} from 'src/api/client';
import {useFetchHistories} from 'src/hooks/query';
import {updateNotification} from 'src/store/notification';

interface Props {}

const HistoryTab: FC<Props> = props => {
  const {data, isLoading, isFetching} = useFetchHistories();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  const noData = !data?.length;

  const [selectedHistories, setSelectedHistories] = useState<string[]>([]);

  const removeMutation = useMutation({
    mutationFn: async histories => await removeHistories(histories),
    onMutate: (histories: string[]) => {
      queryClient.setQueryData<History[]>(['histories'], oldData => {
        let newData: History[] = [];
        if (!oldData) return newData;

        for (let data of oldData) {
          const filteredData = data.audios.filter(
            item => !histories.includes(item.id),
          );
          if (filteredData.length) {
            newData.push({date: data.date, audios: filteredData});
          }
        }
        return newData;
      });
    },
  });

  const removeHistories = async (histories: string[] | void) => {
    try {
      const client = await getClient();
      await client.delete(`/history?histories=${JSON.stringify(histories)}`);
      queryClient.invalidateQueries({queryKey: ['histories']});
      dispatch(
        updateNotification({
          message: 'Your histories will be removed!',
          type: 'success',
        }),
      );
    } catch (error) {
      const messageError = catchAsyncError(error);
      dispatch(updateNotification({message: messageError, type: 'error'}));
    }
  };

  const handleSingleHistoryRemove = (history: HistoryAudio) => async () => {
    removeMutation.mutate([history.id]);
    // await removeHistories([history.id]);
  };

  const handleMultipleHistoryRemove = async () => {
    setSelectedHistories([]);
    removeMutation.mutate([...selectedHistories]);
    // await removeHistories([...selectedHistories]);
  };

  const handleOnLongPress = (history: HistoryAudio) => () => {
    setSelectedHistories([history.id]);
  };

  const handleOnPress = (history: HistoryAudio) => () => {
    setSelectedHistories(old => {
      if (old.includes(history.id)) {
        return old.filter(item => item !== history.id);
      }
      return [...old, history.id];
    });
  };

  const handleOnRefresh = () => {
    queryClient.invalidateQueries({queryKey: ['histories']});
  };

  useEffect(() => {
    const unSelectHistories = () => {
      setSelectedHistories([]);
    };
    navigation.addListener('blur', unSelectHistories);
    return () => {
      navigation.removeListener('blur', unSelectHistories);
    };
  }, []);

  if (isLoading) return <AudioListLoadingUI />;

  return (
    <>
      {selectedHistories.length ? (
        <Pressable
          onPress={handleMultipleHistoryRemove}
          style={styles.removeBtn}>
          <Text style={styles.removeBtnText}>Remove</Text>
        </Pressable>
      ) : null}
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            tintColor={colors.CONTRAST}
            onRefresh={handleOnRefresh}
          />
        }
        style={styles.container}>
        {noData ? <EmptyRecords title="There is no history!" /> : null}
        {data?.map((item, mainIndex) => {
          return (
            <View key={item.date + mainIndex || mainIndex}>
              <Text style={styles.date}>{item.date}</Text>
              <View style={styles.listContainer}>
                {item.audios.map((audio, index) => {
                  return (
                    <Pressable
                      onLongPress={handleOnLongPress(audio)}
                      onPress={handleOnPress(audio)}
                      key={audio.id + index || index}
                      style={[
                        styles.history,
                        {
                          backgroundColor: selectedHistories.includes(audio.id)
                            ? colors.INACTIVE_CONTRAST
                            : colors.OVERLAY,
                        },
                      ]}>
                      <Text style={styles.historyTitle}>{audio.title}</Text>
                      <Pressable onPress={handleSingleHistoryRemove(audio)}>
                        <AntDesign name="close" color={colors.CONTRAST} />
                      </Pressable>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </>
  );
};

export default HistoryTab;

const styles = StyleSheet.create({
  container: {},
  listContainer: {
    paddingLeft: 10,
    paddingTop: 10,
  },
  date: {
    color: colors.SECONDARY,
  },
  history: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.OVERLAY,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  historyTitle: {
    color: colors.CONTRAST,
    paddingHorizontal: 5,
    fontWeight: '700',
    flex: 1,
  },
  removeBtn: {
    padding: 10,
    alignSelf: 'flex-end',
  },
  removeBtnText: {color: colors.CONTRAST},
});
