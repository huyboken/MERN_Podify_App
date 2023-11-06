import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '.';

type NotificationType = 'error' | 'success';

interface Notification {
  message: string;
  type: NotificationType;
}

const initialState: Notification = {
  message: '',
  type: 'error',
};

const slice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    updateNotification(
      notificationState,
      {payload}: PayloadAction<Notification>,
    ) {
      notificationState.message = payload.message;
      notificationState.type = payload.type;
    },
  },
});

export const {updateNotification} = slice.actions;

export const getNotificationState = createSelector(
  (state: RootState) => state,
  ({notification}) => notification,
);

export default slice.reducer;
