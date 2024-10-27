import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
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

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
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
      .post(`http://192.168.31.155:8000/login`, user)
      .then((response) => {
        const token = response.data.token;
        AsyncStorage.setItem('authToken', token);
        navigation.replace('Main');
      })
      .catch(() => {
        Alert.alert('Login Error', 'Invalid Email or Password');
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require('../assets/splashScreen.png')}
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
          <Text style={styles.rememberText}>Keep me logged in</Text>
          <Text style={styles.forgotText}>Forgot Password</Text>
        </View>

        <Pressable style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </Pressable>

        <Pressable style={styles.signupLink} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fc',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#041E42',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderColor: '#6c757d',
    borderWidth: 1,
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
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  rememberText: {
    color: '#495057',
  },
  forgotText: {
    color: '#007BFF',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    width: '60%',
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
  signupLink: {
    marginTop: 10,
  },
  signupText: {
    color: '#6c757d',
    fontSize: 16,
  },
});
