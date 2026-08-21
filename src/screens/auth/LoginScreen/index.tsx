import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { Mail } from 'lucide-react-native';

import IconInput from '../../../components/ui/IconInput';
import PasswordField from '../../../components/ui/PasswordField';
import RegularButton from '../../../components/ui/RegularButton';

import { Colors } from '../../../constant/colors';

import AuthUIWrapper from '../../../components/wrappers/AuthUIWrapper';
import FormComponentWrapper from '../../../components/wrappers/FormComponentWrapper';

import { AuthAPI } from '../../../api/auth';

import { useDispatch } from 'react-redux';
import { saveToken } from '../../../store/authSlice';

import { persistLogin } from '../../../util/localStorage';

import { useNavigation } from '@react-navigation/native';

import useSocialAuth from '../../../hooks/useSocialAuth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();

  const nav: any = useNavigation();

  const handleContinue = async () => {
    setError(null);

    if (!email && !password) {
      setError('Please enter email and password');
      return;
    }

    if (!email) {
      setError('Please enter the email');
      return;
    }

    if (!password) {
      setError('Please enter the password');
      return;
    }

    setLoading(true);

    try {
      console.log('========== LOGIN START ==========');
      console.log('EMAIL:', email);
      console.log('=================================');

      const data = await AuthAPI.login({
        email,
        password,
      });

      console.log('========== LOGIN SUCCESS ==========');
      console.log('ACCESS TOKEN RECEIVED:', !!data.accessToken);
      console.log('REFRESH TOKEN RECEIVED:', !!data.refreshToken);
      console.log('===================================');

      dispatch(
        saveToken({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        }),
      );

      await persistLogin(data.refreshToken);

      console.log('Login completed successfully');

    } catch (err: any) {
      console.log('========== LOGIN FAILED ==========');

      console.log('MESSAGE:', err?.message);

      console.log(
        'STATUS:',
        err?.response?.status,
      );

      console.log(
        'SERVER DATA:',
        JSON.stringify(err?.response?.data, null, 2),
      );

      console.log(
        'BASE URL:',
        err?.config?.baseURL,
      );

      console.log(
        'ENDPOINT:',
        err?.config?.url,
      );

      console.log(
        'FULL URL:',
        `${err?.config?.baseURL || ''}${err?.config?.url || ''}`,
      );

      console.log('==================================');

      const status = err?.response?.status;

      const serverMessage =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message;

      if (status === 401) {
        setError(
          serverMessage ||
          'Invalid email or password',
        );
      } else if (status === 404) {
        setError(
          'Login API endpoint was not found',
        );
      } else if (status === 500) {
        setError(
          serverMessage ||
          'Server error. Please try again later.',
        );
      } else if (
        err?.message === 'Network Error'
      ) {
        setError(
          'Cannot connect to the deployed server',
        );
      } else {
        setError(
          serverMessage ||
          `Login failed${status ? ` (${status})` : ''}: ${
            err?.message || 'Unknown error'
          }`,
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const {
    authGoogle,
    loading: googleAuthenticating,
  } = useSocialAuth();

  const joinWithGoogle = () => {
    authGoogle();
  };

  return (
    <AuthUIWrapper heightPrecentage={'45%'}>
      <View style={styles.formContainer}>

        <Text style={styles.title}>
          Welcome back
        </Text>

        <Text style={styles.subtitle}>
          Sign in to continue to your account.
        </Text>

        <FormComponentWrapper title="Email">
          <IconInput
            placeholder="Enter your email"
            keyboardType="email-address"
            value={email}
            Icon={Mail}
            onChangeText={setEmail}
          />
        </FormComponentWrapper>

        <FormComponentWrapper title="Password">
          <PasswordField
            password={password}
            setPassword={setPassword}
            placeholder="Enter your password"
          />
        </FormComponentWrapper>

        {error && (
          <Text style={styles.error}>
            {error}
          </Text>
        )}

        <RegularButton
          Icon={undefined}
          text="Continue"
          onPress={handleContinue}
          loading={loading}
          marginTop={20}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginVertical: 10,
            height: 20,
          }}
        >
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: '#e7e7e7',
            }}
          />

          <Text style={styles.dividerText}>
            Or
          </Text>

          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: '#e7e7e7',
            }}
          />
        </View>

        <RegularButton
          Icon={undefined}
          variant="outline"
          text="Join with Google"
          onPress={joinWithGoogle}
          loading={googleAuthenticating}
        />

        <TouchableOpacity
          onPress={() => nav.navigate('Signup')}
        >
          <Text style={styles.footerText}>
            Don't have an account?{' '}
            <Text style={styles.link}>
              Sign up
            </Text>
          </Text>
        </TouchableOpacity>

      </View>
    </AuthUIWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  imageContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  formContainer: {
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingBottom: 50,

    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },

  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 24,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#E5E7EB',

    borderRadius: 12,

    paddingHorizontal: 12,
    paddingVertical: 10,

    marginBottom: 16,

    gap: 8,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },

  error: {
    color: '#DC2626',
    fontSize: 13,
    marginBottom: 12,
  },

  button: {
    backgroundColor: '#E8623A',

    borderRadius: 12,

    paddingVertical: 14,

    alignItems: 'center',

    marginTop: 8,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  dividerText: {
    fontSize: 13,
  },

  footerText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 13,
    marginTop: 24,
  },

  link: {
    color: '#E8623A',
    fontWeight: '700',
  },

  nest: {
    color: Colors.SECONDARY_COLOR,
    fontSize: 30,
    fontWeight: '700',
  },
});