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
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  const handleRegister = () => {
    const user = {
      name: name,
      email: email,
      password: password,
    };
    console.log(user.email)
    // send a post request to the backend API
    axios
      .post(`http://192.168.31.155:8000/register`, user)
      .then((response) => {
        Alert.alert(
          'Registration Successfull',
          'You have registered successfully'
        );
        setName('');
        setEmail('');
        setPassword('');
      })
      .catch((error) => {
        Alert.alert(
          'Registration Error',
          'An error occured during registration'
        );
        setName('');
        setEmail('');
        setPassword('');
        console.log('registration failed', error);
      });
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logoImage}
          source={require('../assets/splashScreen.png')
          }
        />
      </View>

      <Text style={styles.titleText}>Register to your Account</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="ios-person" size={24} style={styles.inputIcon} />
        <TextInput
          value={name}
          onChangeText={(text) => setName(text)}
          style={styles.inputField}
          placeholder="Enter your Name"
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={24} style={styles.inputIcon} />
        <TextInput
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.inputField}
          placeholder="Enter your Email"
        />
      </View>

      <View style={styles.inputContainer}>
        <AntDesign name="lock1" size={24} style={styles.inputIcon} />
        <TextInput
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.inputField}
          placeholder="Enter your Password"
          secureTextEntry
        />
      </View>

      <Pressable onPress={handleRegister} style={styles.button}>
        <Text style={styles.buttonText}>Register</Text>
      </Pressable>

      <Pressable onPress={() => navigation.goBack()}>
        <Text style={styles.footerText}>Already have an account? Sign In</Text>
      </Pressable>
    </SafeAreaView>
  )
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginTop: 80,
    alignItems: 'center',
  },
  logoImage: {
    width: 150,
    height: 150,
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#041E42',
    marginVertical: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
  },
  inputIcon: {
    marginRight: 10,
    color: 'gray',
  },
  inputField: {
    color: '#333',
    fontSize: 16,
    flex: 1,
  },
  button: {
    width: 200,
    backgroundColor: '#FEBE10',
    borderRadius: 6,
    paddingVertical: 15,
    alignSelf: 'center',
    marginTop: 40,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 16,
    marginTop: 20,
  },
});

