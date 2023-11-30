import {AudioData, History, Playlist} from 'src/@types/audio';
import catchAsyncError from 'src/api/catchError';
import {getClient} from 'src/api/client';
import {updateNotification} from 'src/store/notification';
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

const fetchUploadsByProfile = async (): Promise<AudioData[]> => {
  const client = await getClient();
  const {data} = await client('/profile/uploads');
  return data.audios;
};

export const useFetchUploadsByProfile = () => {
  const dispatch = useDispatch();

  return useQuery(['upload-by-profile'], {
    queryFn: () => fetchUploadsByProfile(),
    onError(err) {
      const messageError = catchAsyncError(err);
      dispatch(updateNotification({message: messageError, type: 'error'}));
    },
  });
};

const fetchFavorite = async (): Promise<AudioData[]> => {
  const client = await getClient();
  const {data} = await client('/favorite');
  return data.audios;
};

export const useFetchFavorite = () => {
  const dispatch = useDispatch();

  return useQuery(['favorite'], {
    queryFn: () => fetchFavorite(),
    onError(err) {
      const messageError = catchAsyncError(err);
      dispatch(updateNotification({message: messageError, type: 'error'}));
    },
  });
};

const fetchHistories = async (): Promise<History[]> => {
  const client = await getClient();
  const {data} = await client('/history');
  return data.histories;
};

export const useFetchHistories = () => {
  const dispatch = useDispatch();

  return useQuery(['histories'], {
    queryFn: () => fetchHistories(),
    onError(err) {
      const messageError = catchAsyncError(err);
      dispatch(updateNotification({message: messageError, type: 'error'}));
    },
  });
};

const fetchRecentlyPlayed = async (): Promise<AudioData[]> => {
  const client = await getClient();
  const {data} = await client('/history/recently-played');
  return data.audios;
};

export const useFetchRecentlyPlayed = () => {
  const dispatch = useDispatch();

  return useQuery(['recently-played'], {
    queryFn: () => fetchRecentlyPlayed(),
    onError(err) {
      const messageError = catchAsyncError(err);
      dispatch(updateNotification({message: messageError, type: 'error'}));
    },
  });
};

const fetchRecommendedPlaylist = async (): Promise<Playlist[]> => {
  const client = await getClient();
  const {data} = await client('/profile/auto-generated-playlist');
  return data.playlist;
};

export const useFetchRecommendedPlaylist = () => {
  const dispatch = useDispatch();

  return useQuery(['recommended-playlist'], {
    queryFn: () => fetchRecommendedPlaylist(),
    onError(err) {
      const messageError = catchAsyncError(err);
      dispatch(updateNotification({message: messageError, type: 'error'}));
    },
  });
};

const fetchIsFavorite = async (id: string): Promise<boolean> => {
  const client = await getClient();
  const {data} = await client('/favorite/is-fav?audioId=' + id);
  return data.result;
};

export const useFetchIsFavorite = (id: string) => {
  const dispatch = useDispatch();

  return useQuery(['favorite', id], {
    queryFn: () => fetchIsFavorite(id),
    onError(err) {
      const messageError = catchAsyncError(err);
      dispatch(updateNotification({message: messageError, type: 'error'}));
    },
    enabled: id ? true : false,
  });
};
