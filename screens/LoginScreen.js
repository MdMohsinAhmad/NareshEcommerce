import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const [tokenfound, setTokenFound] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          setTokenFound(false);
          navigation.replace('Main');
        }
      } catch (err) {
        console.log('error message', err);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = () => {
    const user = { email, password };

    axios
      .post(`http://192.168.31.155:8800/login`, user)
      .then((response) => {
        const token = response.data.token;
        AsyncStorage.setItem('authToken', token);
        navigation.replace('Main');
      })
      .catch(() => {
        Alert.alert('Login Error', 'Invalid Email or Password');
      });
  };

  if (tokenfound) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0F70E6" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require('../assets/logo.png')}
        />
      </View>

      <KeyboardAvoidingView style={styles.keyboardContainer}>
        <Text style={styles.headerText}>Login to your Account</Text>

        <View style={styles.inputContainer}>
          <View style={styles.inputField}>
            <MaterialIcons name="email" size={24} color="#6c757d" />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your Email"
              placeholderTextColor="#6c757d"
              style={styles.inputText}
            />
          </View>

          <View style={styles.inputField}>
            <AntDesign name="lock1" size={24} color="#6c757d" />
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Enter your Password"
              placeholderTextColor="#6c757d"
              style={styles.inputText}
            />
          </View>
        </View>

        <View style={styles.optionsContainer}>
          <Text style={styles.forgotText}>Forgot Password ?</Text>
        </View>

        <Pressable style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </Pressable>

        <Pressable
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'center',
          }}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.signupText}>Don't have an account? </Text>
          <Text style={styles.signupTextsignin}>Sign Up</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222f3e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
  },
  keyboardContainer: {
    width: '90%',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#c8d6e5',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  inputText: {
    color: '#343a40',
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },
  optionsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 15,
  },
  forgotText: {
    color: '#c8d6e5',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#0F70E6',
    borderRadius: 25,
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    marginVertical: 20,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signupText: {
    color: '#888',
    fontSize: 16,
  },
  signupTextsignin: {
    color: '#c8d6e5',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
