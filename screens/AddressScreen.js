import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import { UserType } from '../UserContext';
import axios from 'axios';

const AddressScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const { userId, setUserId } = useContext(UserType);


  
  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.userId;
        setUserId(userId);
      }
    };
    fetchUser();
  }, []);

  const handleAddAddress = () => {
    // Check for empty fields
    if (!name || !mobileNo || !houseNo || !street || !postalCode) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return; // Exit early if validation fails
    }

    const address = {
      name,
      mobileNo,
      houseNo,
      street,
      landmark,
      postalCode,
    };

    axios
      .post('http://192.168.31.155:8800/addresses', { userId, address })
      .then((response) => {
        Alert.alert('Success', 'Address added successfully');
        resetForm();
        setTimeout(() => {
          navigation.goBack();
        }, 500);
      })
      .catch((error) => {
        Alert.alert('Error', 'Failed to add address');
        console.error('Error:', error);
      });
  };

  const resetForm = () => {
    setName('');
    setMobileNo('');
    setHouseNo('');
    setStreet('');
    setLandmark('');
    setPostalCode('');
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.header} />
      <View style={styles.container}>
        <Text style={styles.title}>Add a New Address</Text>

        <TextInput
          placeholder="Country (e.g., India)"
          placeholderTextColor="#A9A9A9"
          style={styles.input}
        />

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholderTextColor={'#A9A9A9'}
            placeholder="Enter your name"
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            value={mobileNo}
            onChangeText={setMobileNo}
            placeholderTextColor={'#A9A9A9'}
            placeholder="Mobile No"
            style={styles.input}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Flat/House No</Text>
          <TextInput
            value={houseNo}
            onChangeText={setHouseNo}
            placeholderTextColor={'#A9A9A9'}
            placeholder="Enter your flat/house number"
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Area/Street</Text>
          <TextInput
            value={street}
            onChangeText={setStreet}
            placeholderTextColor={'#A9A9A9'}
            placeholder="Enter area/street"
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Landmark</Text>
          <TextInput
            value={landmark}
            onChangeText={setLandmark}
            placeholderTextColor={'#A9A9A9'}
            placeholder="E.g., near Apollo Hospital"
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pincode</Text>
          <TextInput
            value={postalCode}
            onChangeText={setPostalCode}
            placeholderTextColor={'#A9A9A9'}
            placeholder="Enter Pincode"
            style={styles.input}
            keyboardType="numeric"
          />
        </View>

        <Pressable onPress={handleAddAddress} style={styles.button}>
          <Text style={styles.buttonText}>Add Address</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default AddressScreen;

const styles = StyleSheet.create({
  scrollView: {
    marginTop: 50,
    backgroundColor: '#F5F5F5', // Set a light background color for contrast
  },
  header: {
    height: 0.5,
    backgroundColor: 'transparent', // Add a header color
  },
  container: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF', // Use white background for container
    margin: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333', // Darker title for better visibility
    marginBottom: 20,
  },
  inputGroup: {
    marginVertical: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555', // Slightly lighter color for labels
  },
  input: {
    padding: 12,
    borderColor: '#D0D0D0',
    borderWidth: 1,
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: '#F9F9F9', // Light gray input background for contrast
  },
  button: {
    backgroundColor: '#FFC72C', // Highlighted button color
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#000', // Button text color
    fontSize: 16,
  },
});
