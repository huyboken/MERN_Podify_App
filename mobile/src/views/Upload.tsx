import catchAsyncError from 'src/api/catchError';
import {getClient} from 'src/api/client';
import {updateNotification} from 'src/store/notification';
import {mapRange} from '@utils/math';
import React, {FC, useState} from 'react';
import {useDispatch} from 'react-redux';
import AudioForm from '@components/form/AudioForm';

interface Props {}

const Upload: FC<Props> = props => {
  const dispatch = useDispatch();

  const [uploadProgress, setUploadProgress] = useState(0);
  const [busy, setBusy] = useState(false);

  const handleUpload = async (formData: FormData) => {
    setBusy(true);
    try {
      const client = await getClient({'Content-Type': 'multipart/form-data;'});

      await client.post('/audio/create/', formData, {
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
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(updateNotification({type: 'error', message: errorMessage}));
    }
    setBusy(false);
  };

  return (
    <AudioForm onSubmit={handleUpload} busy={busy} progress={uploadProgress} />
  );
};

export default Upload;
