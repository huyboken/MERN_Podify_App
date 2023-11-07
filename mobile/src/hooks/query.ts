import {AudioData} from '@src/@type/audio';
import catchAsyncError from '@src/api/catchError';
import client from '@src/api/client';
import {updateNotification} from '@src/store/notification';
import {useQuery} from 'react-query';
import {useDispatch} from 'react-redux';

const fetchLatest = async (): Promise<AudioData[]> => {
  const {data} = await client.get('/audio/latest');
  return data.audios;
};

export const useFetchLatestAudios = () => {
  const dispatch = useDispatch();

  return useQuery(['latest-uploads'], {
    queryFn: () => fetchLatest(),
    onError(err) {
      const messageError = catchAsyncError(err);
      dispatch(updateNotification({message: messageError, type: 'error'}));
    },
  });
};

const fetchRecommended = async (): Promise<AudioData[]> => {
  const {data} = await client.get('/profile/recommended');
  return data.audios;
};

export const fetchRecommendedAudios = () => {
  const dispatch = useDispatch();

  return useQuery(['recommended'], {
    queryFn: () => fetchRecommended(),
    onError(err) {
      const messageError = catchAsyncError(err);
      dispatch(updateNotification({message: messageError, type: 'error'}));
    },
  });
};
