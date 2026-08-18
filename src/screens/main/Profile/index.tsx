import React, {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  launchImageLibrary,
} from 'react-native-image-picker';

import {
  CalendarDays,
  Camera,
  Check,
  LogOut,
  User,
} from 'lucide-react-native';

import {
  useNavigation,
} from '@react-navigation/native';

import {
  useDispatch,
} from 'react-redux';

import Typography from '../../../components/ui/Typography';

import {
  Colors,
} from '../../../constant/colors';

import {
  ProfileAPI,
} from '../../../api/profile';

import type {
  UserProfile,
} from '../../../types/profile';

import {
  logout,
} from '../../../store/authSlice';

import {
  removeRefreshToken,
} from '../../../util/localStorage';

const Profile = () => {
  const navigation: any =
    useNavigation();

  const dispatch =
    useDispatch();

  const [
    profile,
    setProfile,
  ] = useState<UserProfile | null>(
    null,
  );

  const [
    displayName,
    setDisplayName,
  ] = useState('');

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    uploadingImage,
    setUploadingImage,
  ] = useState(false);

  const loadProfile =
    async () => {
      try {
        setLoading(true);

        const data =
          await ProfileAPI.getMe();

        setProfile(data);

        setDisplayName(
          data.displayName ?? '',
        );
      } catch (error: any) {
        console.error(
          'Unable to load profile:',
          error,
        );

        Alert.alert(
          'Error',
          'Unable to load your profile.',
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSelectImage =
    async () => {
      const result =
        await launchImageLibrary({
          mediaType: 'photo',
          selectionLimit: 1,
          quality: 0.8,
        });

      if (result.didCancel) {
        return;
      }

      const asset =
        result.assets?.[0];

      if (!asset?.uri) {
        return;
      }

      try {
        setUploadingImage(true);

        const uploadResult =
          await ProfileAPI.uploadProfileImage(
            asset.uri,
            asset.type ??
              'image/jpeg',
            asset.fileName ??
              `profile-${Date.now()}.jpg`,
          );

        const updated =
          await ProfileAPI.updateMe({
            avatarUrl:
              uploadResult.url,
          });

        setProfile(updated);

        setDisplayName(
          updated.displayName ?? '',
        );

        Alert.alert(
          'Success',
          'Profile image updated.',
        );
      } catch (error: any) {
        console.error(
          'Profile image upload failed:',
          error,
        );

        const message =
          error?.response?.data?.error
            ?.message ??
          error?.response?.data
            ?.message ??
          'Unable to upload profile image.';

        Alert.alert(
          'Upload failed',
          message,
        );
      } finally {
        setUploadingImage(false);
      }
    };

  const handleSave =
    async () => {
      const trimmedName =
        displayName.trim();

      if (
        trimmedName.length < 2
      ) {
        Alert.alert(
          'Invalid name',
          'Display name must contain at least 2 characters.',
        );

        return;
      }

      try {
        setSaving(true);

        const updated =
          await ProfileAPI.updateMe({
            displayName:
              trimmedName,
          });

        setProfile(updated);

        setDisplayName(
          updated.displayName ?? '',
        );

        Alert.alert(
          'Success',
          'Profile updated successfully.',
        );
      } catch (error: any) {
        console.error(
          'Profile update failed:',
          error,
        );

        const message =
          error?.response?.data?.error
            ?.message ??
          error?.response?.data
            ?.message ??
          'Unable to update your profile.';

        Alert.alert(
          'Update failed',
          message,
        );
      } finally {
        setSaving(false);
      }
    };

  const handleLogout =
    () => {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Logout',
            style: 'destructive',

            onPress:
              async () => {
                try {
                  /*
                   * Remove the persisted refresh token
                   * first so the session cannot be
                   * restored when the app starts again.
                   */
                  await removeRefreshToken();

                  /*
                   * Clear accessToken,
                   * refreshToken and
                   * isAuthenticated from Redux.
                   */
                  dispatch(logout());
                } catch (error) {
                  console.error(
                    'Logout failed:',
                    error,
                  );

                  /*
                   * Even if storage removal has an
                   * unexpected problem, clear Redux
                   * authentication state.
                   */
                  dispatch(logout());
                }
              },
          },
        ],
      );
    };

  if (loading) {
    return (
      <View
        style={styles.center}
      >
        <ActivityIndicator
          size="large"
          color={
            Colors.PRIMARY_COLOR
          }
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
      keyboardShouldPersistTaps="handled"
    >
      <Typography variant="h1">
        Profile
      </Typography>

      {/* PROFILE HEADER */}
      <View
        style={styles.profileCard}
      >
        <TouchableOpacity
          style={
            styles.avatarWrapper
          }
          onPress={
            handleSelectImage
          }
          disabled={
            uploadingImage
          }
        >
          {profile?.avatarUrl ? (
            <Image
              source={{
                uri:
                  profile.avatarUrl,
              }}
              style={
                styles.avatar
              }
            />
          ) : (
            <View
              style={
                styles.avatarPlaceholder
              }
            >
              <User
                size={52}
                color={
                  Colors.SECONDARY_COLOR
                }
              />
            </View>
          )}

          <View
            style={
              styles.cameraButton
            }
          >
            {uploadingImage ? (
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />
            ) : (
              <Camera
                size={18}
                color="#FFFFFF"
              />
            )}
          </View>
        </TouchableOpacity>

        <Typography
          variant="h2"
          style={
            styles.profileName
          }
        >
          {profile?.displayName ||
            'User'}
        </Typography>

        <Typography
          variant="caption"
          style={styles.email}
        >
          {profile?.email || ''}
        </Typography>
      </View>

      {/* EDIT PROFILE */}
      <View style={styles.form}>
        <Typography
          variant="h3"
          style={
            styles.sectionTitle
          }
        >
          Edit Profile
        </Typography>

        <Typography
          variant="caption"
          style={styles.label}
        >
          Display Name
        </Typography>

        <TextInput
          value={displayName}
          onChangeText={
            setDisplayName
          }
          placeholder="Enter your display name"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          maxLength={100}
          autoCapitalize="words"
          editable={!saving}
        />

        <TouchableOpacity
          style={[
            styles.saveButton,
            saving &&
              styles.disabledButton,
          ]}
          onPress={
            handleSave
          }
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator
              color="#FFFFFF"
            />
          ) : (
            <>
              <Check
                size={20}
                color="#FFFFFF"
              />

              <Typography
                variant="h3"
                style={
                  styles.saveButtonText
                }
              >
                Save Changes
              </Typography>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* MY BOOKINGS */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() =>
          navigation.navigate(
            'MyBookings',
          )
        }
      >
        <CalendarDays
          size={22}
          color={
            Colors.SECONDARY_COLOR
          }
        />

        <Typography variant="h3">
          My Bookings
        </Typography>
      </TouchableOpacity>

      {/* NOTIFICATIONS */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() =>
          navigation.navigate(
            'Notifications',
          )
        }
      >
        <Typography variant="h3">
          Notifications
        </Typography>
      </TouchableOpacity>

      {/* LOGOUT */}
      <TouchableOpacity
        style={[
          styles.menuButton,
          styles.logoutButton,
        ]}
        onPress={
          handleLogout
        }
      >
        <LogOut
          size={22}
          color="#DC2626"
        />

        <Typography
          variant="h3"
          style={
            styles.logoutText
          }
        >
          Logout
        </Typography>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      Colors.WHITE,
  },

  content: {
    padding: 20,
    gap: 24,
    paddingBottom: 120,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileCard: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 6,
  },

  avatarWrapper: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },

  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:
      Colors.PRIMARY_COLOR,
  },

  profileName: {
    textAlign: 'center',
  },

  email: {
    color: '#6B7280',
  },

  form: {
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    gap: 10,
  },

  sectionTitle: {
    marginBottom: 6,
  },

  label: {
    color: '#6B7280',
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#111827',
  },

  saveButton: {
    height: 52,
    marginTop: 10,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor:
      Colors.PRIMARY_COLOR,
  },

  disabledButton: {
    opacity: 0.6,
  },

  saveButtonText: {
    color: '#FFFFFF',
  },

  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 18,
    borderRadius: 16,
    backgroundColor:
      Colors.WHITE,
    elevation: 2,
  },

  logoutButton: {
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },

  logoutText: {
    color: '#DC2626',
  },
});