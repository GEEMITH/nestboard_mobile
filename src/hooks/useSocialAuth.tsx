import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { statusCodes } from '@react-native-google-signin/google-signin';
import { AuthAPI } from '../api/auth';
import { useDispatch } from 'react-redux';
import { saveToken } from '../store/authSlice';
import { persistLogin } from '../util/localStorage';
import { useNavigation } from '@react-navigation/native';

export const useSocialAuth = () => {

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '950335036729-eslltcko0jd5eaekd3akoukt9nmeqt7j.apps.googleusercontent.com', // sets ID token audience — must match GOOGLE_CLIENT_IDS in backend .env
      // iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com', // omit if already set in GoogleService-Info.plist
      offlineAccess: false, // true only if you need a server-side refresh token from Google itself (not needed here — your own backend issues its own tokens)
    });
  }, [])

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const authGoogle = async () => {
    try {
      setLoading(true);
      GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signIn();

      const idToken = userInfo.data?.idToken;
      if (!idToken) {
        throw new Error('No ID token returned from Google');
      }

      console.log("idToken", idToken);

      const tokens = await AuthAPI.socialAuth(idToken);

      // Save the tokens inside the global state using redux
      dispatch(saveToken({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      }))

      //Save the refresh token inside the device storage
      persistLogin(tokens.refreshToken)

      // onSignedIn(tokens);
    } catch (error: any) {
      console.error('Error setting up request:', error);
    } finally {
      setLoading(false);
    }
  }

  return {
    authGoogle,
    loading
  }

}

export default useSocialAuth