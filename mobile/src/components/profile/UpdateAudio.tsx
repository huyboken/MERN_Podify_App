import AudioForm from '@components/form/AudioForm';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {mapRange} from '@utils/math';
import React, {FC, useState} from 'react';
import {useQueryClient} from 'react-query';
import {useDispatch} from 'react-redux';
import {ProfileNavigatorParamList} from 'src/@types/navigation';
import catchAsyncError from 'src/api/catchError';
import {getClient} from 'src/api/client';
import {updateNotification} from 'src/store/notification';

type Props = NativeStackScreenProps<ProfileNavigatorParamList, 'UpdateAudio'>;

const UpdateAudio: FC<Props> = props => {
  const {audio} = props.route.params;
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const {navigate} = useNavigation<NavigationProp<ProfileNavigatorParamList>>();

  const [uploadProgress, setUploadProgress] = useState(0);
  const [busy, setBusy] = useState(false);

  const handleUpdate = async (formData: FormData) => {
    setBusy(true);
    try {
      const client = await getClient({'Content-Type': 'multipart/form-data;'});

      await client.patch('/audio/' + audio.id, formData, {
        onUploadProgress(progressEvent) {
          const uploaded = mapRange({
            inputMin: 0,
            inputMax: progressEvent.total || 0,
            outputMin: 0,
            outputMax: 100,
            inputValue: progressEvent.loaded,
          });

          if (uploaded >= 100) {
            setBusy(false);
          }

          setUploadProgress(Math.floor(uploaded));
        },
      });
      queryClient.invalidateQueries({queryKey: ['uploads-by-profile']});
      navigate('Profile');
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(updateNotification({type: 'error', message: errorMessage}));
    }
    setBusy(false);
  };
  return (
    <AudioForm
      onSubmit={handleUpdate}
      initialValues={{
        title: audio.title,
        category: audio.category,
        about: audio.about,
      }}
      busy={busy}
      progress={uploadProgress}
    />
  );
};

export default UpdateAudio;
