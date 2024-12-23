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
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, AntDesign, Ionicons } from '@expo/vector-icons'; // Add Ionicons for the eye icon
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import URL_path from '../URL';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          navigation.replace('Main');
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        console.log('Error checking token:', err);
        setIsLoading(false);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    if (!email || !password) {
      Alert.alert('Notice', 'Enter Email and Password')
      setLoading(false)
      return
    }
    const user = { email, password };

    axios
      .post(`${URL_path}/login`, user)
      .then((response) => {
        setLoading(false)
        const token = response.data.token;
        AsyncStorage.setItem('authToken', token);
        navigation.replace('Main');
      })
      .catch(() => {
        setLoading(false)
        Alert.alert('Login Error', 'Invalid Email or Password');
      });
  };

  if (isLoading) {
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
          source={require('../assets/logo-color1.png')}
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
              secureTextEntry={!passwordVisible} // Toggle password visibility
              placeholder="Enter your Password"
              placeholderTextColor="#6c757d"
              style={styles.inputText}
            />
            <Pressable onPress={() => setPasswordVisible(!passwordVisible)}>
              <Ionicons
                name={passwordVisible ? "eye" : "eye-off"}
                size={24}
                color="#6c757d"
              />
            </Pressable>
          </View>
        </View>

        <Pressable style={styles.optionsContainer} onPress={() => navigation.navigate('RequestPassword')}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </Pressable>

        <Pressable style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>{loading ? "Logging In..." : 'Login'}</Text>
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

        <Text style={{marginTop:50,color:'#dfe6e9'}}>By continuing, you agree to our</Text>
        <Text style={{marginTop:10,}}><Text onPress={()=>navigation.navigate('termsservices')} style={{color:'#0984e3',marginRight:4,fontSize:12}}>Terms of Service  </Text> 
        <Text style={{color:'#ff7675',marginRight:4,textDecorationStyle:'dashed',fontSize:12}} onPress={()=>navigation.navigate('policy')}>Privacy Policy  </Text>
        <Text style={{color:'#fdcb6e',marginRight:4,fontSize:12}} onPress={()=>navigation.navigate('contentpolicy')}>Content Policy</Text></Text>
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
    marginBottom: 20,height:120,width:150,backgroundColor:'white',
    display:'flex',justifyContent:'center',alignItems:'center',borderRadius: 5,
  },
  logo: {
    width: 125,
    height: 70, borderRadius: 1,
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
    flex: 1,fontWeight:'bold'
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
