import {AudioData, Playlist} from '@src/@type/audio';
import catchAsyncError from '@src/api/catchError';
import {getClient} from '@src/api/client';
import {updateNotification} from '@src/store/notification';
import {useQuery} from 'react-query';
import {useDispatch} from 'react-redux';

const fetchLatest = async (): Promise<AudioData[]> => {
  const client = await getClient();
  const {data} = await client('/audio/latest');
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
  const client = await getClient();
  const {data} = await client('/profile/recommended');
  return data.audios;
};

export const useFetchRecommendedAudios = () => {
  const dispatch = useDispatch();

  return useQuery(['recommended'], {
    queryFn: () => fetchRecommended(),
    onError(err) {
      const messageError = catchAsyncError(err);
      dispatch(updateNotification({message: messageError, type: 'error'}));
    },
  });
};

const fetchPlaylist = async (): Promise<Playlist[]> => {
  const client = await getClient();
  const {data} = await client('/playlist/by-profile');
  return data.playlist;
};

export const useFetchPlaylist = () => {
  const dispatch = useDispatch();

  return useQuery(['playlist'], {
    queryFn: () => fetchPlaylist(),
    onError(err) {
      const messageError = catchAsyncError(err);
      dispatch(updateNotification({message: messageError, type: 'error'}));
    },
  });
};
