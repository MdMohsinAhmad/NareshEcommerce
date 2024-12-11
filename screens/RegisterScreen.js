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
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, AntDesign, Ionicons, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import URL_path from '../URL';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility

  const handleRegister = () => {
    setLoading(true);

    // Basic validation
    if (!name) {
      Alert.alert('Name Missing', 'Please enter your name');
      setLoading(false);
      return;
    }

    if (!email) {
      Alert.alert('Email Missing', 'Please enter your email');
      setLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (!mobile) {
      Alert.alert('Mobile Missing', 'Please enter your mobile number');
      setLoading(false);
      return;
    }

    // Mobile number validation
    const mobileRegex = /^[0-9]{10}$/; // Assuming a 10-digit mobile number
    if (!mobileRegex.test(mobile)) {
      Alert.alert('Invalid Mobile', 'Mobile number should be 10 digits');
      setLoading(false);
      return;
    }

    if (!password) {
      Alert.alert('Password Missing', 'Please enter a password');
      setLoading(false);
      return;
    }

    // Password validation
    if (password.length < 8) {
      Alert.alert('Password Error', 'Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      const user = { name, email, mobile, password };
      axios.post(`${URL_path}/register`, user)
        .then((res) => {
          console.log(res);
          setLoading(false);
          Alert.alert('Registration Successful', 'You have registered successfully');
          setName('');
          setEmail('');
          setMobile('');
          setPassword('');
          navigation.navigate('Login');
        })
        .catch((err) => {
          setLoading(false);
          Alert.alert('Registration Failed', 'The provided email already exists');
          console.log(err);
          setName('');
          setEmail('');
          setMobile('');
          setPassword('');
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
      Alert.alert('Error', 'Something went wrong');
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <View style={styles.logoContainer}>
            <Image style={styles.logoImage} source={require('../assets/logo-color1.png')} />
          </View>
        </View>
        <Text style={styles.titleText}>Register to Your Account</Text>

        <View style={styles.inputContainer}>
          <Entypo name="user" size={24} style={styles.inputIcon} color="black" />
          <TextInput
            value={name}
            onChangeText={(text) => setName(text)}
            style={styles.inputField}
            placeholder="Enter your Name"
            placeholderTextColor="#888"
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={24} style={styles.inputIcon} />
          <TextInput
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.inputField}
            placeholder="Enter your Email"
            placeholderTextColor="#888"
          />
        </View>
        <View style={styles.inputContainer}>
          <Entypo name="mobile" size={24} style={styles.inputIcon} />
          <TextInput
            value={mobile}
            onChangeText={(text) => setMobile(text)}
            maxLength={10}
            style={styles.inputField}
            placeholder="Enter your Mobile No"
            placeholderTextColor="#888"
          />
        </View>

        <View style={styles.inputContainer}>
          <AntDesign name="lock1" size={24} style={styles.inputIcon} />
          <TextInput
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={styles.inputField}
            placeholder="Enter your Password"
            placeholderTextColor="#888"
            secureTextEntry={!passwordVisible} // Toggle password visibility 
          />
          <Pressable onPress={() => setPasswordVisible(!passwordVisible)}>
            <Ionicons
              name={passwordVisible ? "eye" : "eye-off"}
              size={24}
              color="#6c757d"
            />
          </Pressable>
        </View>

        <Pressable onPress={handleRegister} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
          <Text style={styles.buttonText}>{loading ? 'Registering...' : 'Register'}</Text>
        </Pressable>

        <Pressable onPress={() => navigation.goBack()} style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
          <Text style={styles.footerText}>Already have an account? </Text><Text style={styles.footerTextlogin}>SignIn</Text>
        </Pressable>
        <Text style={{ marginTop: 50, color: '#dfe6e9', textAlign: 'center' }}>By continuing, you agree to our</Text>
        <Text style={{ marginTop: 10, textAlign: 'center' }}><Text onPress={() => navigation.navigate('termsservices')} style={{ color: '#0984e3', marginRight: 4, fontSize: 12 }}>Terms of Service  </Text>
          <Text style={{ color: '#ff7675', marginRight: 4, textDecorationStyle: 'dashed', fontSize: 12 }} onPress={() => navigation.navigate('policy')}>Privacy Policy  </Text>
          <Text style={{ color: '#fdcb6e', marginRight: 4, fontSize: 12 }} onPress={() => navigation.navigate('contentpolicy')}>Content Policy</Text></Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222f3e',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'white',
    height: 120, width: 150,
    justifyContent: 'center',
    borderRadius: 5,
  },
  logoImage: {
    width: 120,
    height: 70, borderRadius: 50,
    marginBottom: 10,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#c8d6e5',
    marginBottom: 10,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 10,
    color: '#888',
  },
  inputField: {
    color: '#333',
    fontSize: 16,
    flex: 1, fontWeight: 'bold'
  },
  button: {
    backgroundColor: '#0F70E6',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#FEBE10',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 2,
  },
  buttonPressed: {
    backgroundColor: '#FFD54F',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footerText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 20,
    // textDecorationLine: 'underline',
  },
  footerTextlogin: {
    textAlign: 'center',
    color: '#c8d6e5',
    fontSize: 16,
    marginTop: 20,
    fontWeight: 'bold'
    // textDecorationLine: 'underline',
  },
});
