// src/screens/LoginScreen.tsx
import React, { useState } from "react";
import {
  View, Text, TouchableOpacity,
  StyleSheet
  ,
} from "react-native";
import { Mail, User } from "lucide-react-native";
import { AuthAPI } from "../../../api/auth";
import FormComponentWrapper from "../../../components/wrappers/FormComponentWrapper";
import IconInput from "../../../components/ui/IconInput";
import PasswordField from "../../../components/ui/PasswordField";
import RegularButton from "../../../components/ui/RegularButton";
import { Colors } from "../../../constant/colors";
import AuthUIWrapper from "../../../components/wrappers/AuthUIWrapper";
import { useDispatch } from "react-redux";
import { saveToken } from "../../../store/authSlice";
import { persistLogin } from "../../../util/localStorage";
import { useNavigation } from "@react-navigation/native";

export default function SignupScreen() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nav: any = useNavigation();

  const dispatch = useDispatch();

  const registerAccount = async () => {
    setError(null);

    if (!email && !password) {
      setError('Please enter all the values');
      return;
    } else if (!email) {
      setError('Please enter the email');
      return;
    } else if (!password) {
      setError('Please enter the password');
      return;
    }
    setLoading(true);
    try {
      const data = await AuthAPI.register({
        email,
        password,
        displayName
      });
      console.log("data ", data)
      // Save the tokens inside the global state using redux
      dispatch(saveToken({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      }))

      //Save the refresh token inside the device storage
      persistLogin(data.refreshToken)
    } catch (err: any) {
      console.log("err.response", err.response)
      if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else {
        setError(err.response.data.error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthUIWrapper heightPrecentage={'30%'}>
      <View style={styles.formContainer}>

        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>Sign up to start booking your next stay.</Text>

        <FormComponentWrapper title="Display Name"  >
          <IconInput
            placeholder="Enter your full name"
            keyboardType="default"
            value={displayName}
            Icon={User}
            onChangeText={setDisplayName}
          />
        </FormComponentWrapper>

        <FormComponentWrapper title="Email"  >
          <IconInput
            placeholder="Enter your email"
            keyboardType="email-address"
            value={email}
            Icon={Mail}
            onChangeText={setEmail}
          />
        </FormComponentWrapper>

        <FormComponentWrapper title="Password" >
          <PasswordField
            password={password}
            setPassword={setPassword}
            placeholder={"Enter your password"}
          />
        </FormComponentWrapper>

        <Text style={styles.textHint}>Password must be at least 8 characters</Text>
        {error && <Text style={styles.error}>{error}</Text>}

        <RegularButton
          Icon={undefined}
          text={"Register"}
          onPress={registerAccount}
          loading={loading}
          marginTop={20}
        />

        {/* Divider*/}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 10, height: 20, }}>
          <View style={{ flex: 1, height: 1, backgroundColor: "#e7e7e7" }}></View>
          <Text style={styles.dividerText}>
            Or
          </Text>
          <View style={{ flex: 1, height: 1, backgroundColor: "#e7e7e7" }}></View>
        </View>

        <RegularButton
          Icon={undefined}
          variant="outline"
          text={"Join with Google"}
          onPress={registerAccount}
          loading={loading}
        />

        <TouchableOpacity onPress={() => nav.navigate('Login')}>
          <Text style={styles.footerText}>
            Already have an account? <Text style={styles.link}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </AuthUIWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageContainer: { flex: 1, justifyContent: 'flex-end', },
  formContainer: {
    padding: 24, justifyContent: 'center', backgroundColor: '#ffffff', paddingBottom: 50,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: { fontSize: 24, fontWeight: '700', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 4, marginBottom: 24 },
  label: { fontSize: 13, fontWeight: '600', color: '#111827', marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 10, marginBottom: 16, gap: 8,
  },
  input: { flex: 1, fontSize: 14, color: '#111827' },
  textHint: { color: 'rgb(139, 139, 139)626', fontSize: 13, marginBottom: 12 },
  error: { color: '#DC2626', fontSize: 13, marginBottom: 12 },
  button: {
    backgroundColor: '#E8623A', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', marginTop: 8,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  dividerText: { fontSize: 13 },
  footerText: { textAlign: 'center', color: '#6B7280', fontSize: 13, marginTop: 24 },
  link: { color: '#E8623A', fontWeight: '700' },
  nest: {
    color: Colors.SECONDARY_COLOR,
    fontSize: 30,
    fontWeight: '700',
  }
});