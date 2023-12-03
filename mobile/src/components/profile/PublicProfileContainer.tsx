import AvatarField from '@ui/AvatarField';
import colors from '@utils/colors';
import React, {FC} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useMutation, useQueryClient} from 'react-query';
import {useDispatch} from 'react-redux';
import {PublicProfile} from 'src/@types/user';
import catchAsyncError from 'src/api/catchError';
import {getClient} from 'src/api/client';
import {useFetchIsFollowing} from 'src/hooks/query';
import {updateNotification} from 'src/store/notification';

interface Props {
  profile?: PublicProfile;
}

const PublicProfileContainer: FC<Props> = ({profile}) => {
  const dispatch = useDispatch();
  const {data: isFollowing} = useFetchIsFollowing(profile?.id || '');
  const queryClient = useQueryClient();

  const followingMutation = useMutation({
    mutationFn: async id => toogleFollowing(id),
    onMutate: (id: string) => {
      queryClient.setQueryData<boolean>(
        ['is-following', id],
        oldData => !oldData,
      );
    },
  });

  const toogleFollowing = async (id: string) => {
    try {
      if (!id) return;

      const client = await getClient();
      await client.post('/profile/update-follower/' + id);
      queryClient.invalidateQueries({queryKey: ['profile', id]});
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(updateNotification({type: 'error', message: errorMessage}));
    }
  };

  if (!profile) return null;
  return (
    <View style={styles.container}>
      <AvatarField source={profile.avatar} />
      <View style={styles.profileInfoContainer}>
        <Text style={styles.profileName}>{profile.name}</Text>
        <Text style={styles.followerText}>{profile.followers} Followers</Text>
        <Pressable
          onPress={() => followingMutation.mutate(profile.id)}
          style={styles.flexRow}>
          <Text style={styles.profileActionLink}>
            {isFollowing ? 'Unfollow' : 'Follow'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default PublicProfileContainer;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfoContainer: {
    marginLeft: 10,
  },
  profileName: {
    color: colors.CONTRAST,
    fontSize: 18,
    fontWeight: '700',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  email: {
    color: colors.CONTRAST,
    marginRight: 5,
  },
  profileActionLink: {
    backgroundColor: colors.SECONDARY,
    color: colors.PRIMARY,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginTop: 5,
  },
  followerText: {
    color: colors.CONTRAST,
    paddingVertical: 2,
    marginTop: 5,
  },
  settingsBtn: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
