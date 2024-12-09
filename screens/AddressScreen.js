import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,Linking 
} from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import URL_path from '../URL';
import { UserType } from '../UserContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

const AddressScreen = ({ navigation }) => {
  const [isManualInput, setIsManualInput] = useState(true);
  const { userId, setUserId } = useContext(UserType);
  const [loading, setLoading] = useState(false)
  const [address, setFormFields] = useState({
    name: '',
    mobileNo: '',
    houseNo: '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    latitude: '',
    longitude: null,
    postalCode: null,
  });
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

  const resetFields = () => {
    setFormFields({
      name: '',
      mobileNo: '',
      houseNo: '',
      street: '',
      landmark: '',
      city: '',
      state: '',
      latitude: '',
      longitude: null,
      postalCode: null,
    })
  }
  const handleEnterAddressManually = () => {
    setIsManualInput(true);
    resetFields()
  };



  const handleAddAddress = async () => {
    setLoading(true)

    if (!address.name || !address.mobileNo || !address.houseNo || !address.street ||
      !address.landmark || !address.city || !address.state || !address.postalCode
    ) {
      Alert.alert('Validation Error', 'Please fill in all fields before submitting.');
      setLoading(false)
      return;
    }

    await axios
      .post(`${URL_path}/addresses`, { userId, address })
      .then(() => {
        setLoading(false)
        Alert.alert('Success', 'Address added successfully!');
        resetFields()
        navigation.goBack();
      })
      .catch((error) => {
        setLoading(false)
        console.error('Error adding address:', error);
        Alert.alert('Error', 'Failed to add address.');
      });
  };
  const handleAutoFetch = async () => {
    setIsManualInput(false);
    try {
      // Check location permissions
      let { status } = await Location.getForegroundPermissionsAsync();
  
      if (status !== 'granted') {
        // Ask for permissions again
        const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
  
        if (newStatus !== 'granted') {
          // If still not granted, guide the user to app settings
          return Alert.alert(
            'Permissions Required',
            'Location permission is denied. To enable it, go to your device settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ]
          );
        }
      }
  
      // If permissions are granted, fetch the location
      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;
      const [result] = await Location.reverseGeocodeAsync({ latitude, longitude });
  
      if (result) {
        setFormFields({
          ...address,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          mobileNo: '', // Mobile needs manual input
          houseNo: result.streetNumber || '',
          street: result.city || '',
          state: result.region || '',
          postalCode: result.postalCode || '',
        });
      } else {
        Alert.alert('Error', 'Unable to retrieve address.');
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      Alert.alert('Error', 'Unable to fetch location.');
    }
  };
  const handleSubmitCoordinates = () => {
    setLoading(true)

    if (!address.name || !address.mobileNo || !address.houseNo || !address.street ||
      !address.landmark || !address.city || !address.state || !address.postalCode ||
      !address.latitude || !address.longitude
    ) {
      Alert.alert('Error', 'Please enter mandatory fields');
      setLoading(false)
      return;
    }

    axios
      .post(`${URL_path}/addresses`, { userId, address })
      .then(() => {
        setLoading(false)
        Alert.alert('Success', 'Address added successfully!');
        resetFields()
        navigation.goBack();
      })
      .catch((error) => {
        setLoading(false)
        console.error('Error adding address:', error);
        Alert.alert('Error', 'Failed to add address.');
      });
  };


  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Add a New Address</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, isManualInput && styles.buttonSelected]}
            onPress={handleEnterAddressManually}
          >
            <Text style={styles.buttonText}>Enter Address Manually</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, !isManualInput && styles.buttonSelected]}
            onPress={handleAutoFetch}
          >
            <Text style={styles.buttonText}>Use Current Address</Text>
          </TouchableOpacity>
        </View>

        {/* Display the input fields if manual input mode is selected */}
        {isManualInput && (
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Full Name*"
              style={styles.input}
              value={address.name}
              onChangeText={(text) => setFormFields({ ...address, name: text })}
            />
            <TextInput
              placeholder="Mobile Number*"
              style={styles.input}
              value={address.mobileNo} maxLength={13}
              onChangeText={(text) => setFormFields({ ...address, mobileNo: text })}
              keyboardType="phone-pad"
            />
            <TextInput
              placeholder="House/Flat No*"
              style={styles.input}
              value={address.houseNo}
              onChangeText={(text) => setFormFields({ ...address, houseNo: text })}
            />
            <TextInput
              placeholder="Street*"
              style={styles.input}
              value={address.street}
              onChangeText={(text) => setFormFields({ ...address, street: text })}
            />
            <TextInput
              placeholder="Landmark*"
              style={styles.input}
              value={address.landmark}
              onChangeText={(text) => setFormFields({ ...address, landmark: text })}
            />
            <TextInput
              placeholder="City*"
              style={styles.input}
              value={address.city}
              onChangeText={(text) => setFormFields({ ...address, city: text })}
            />
            <TextInput
              placeholder="State*"
              style={styles.input}
              value={address.state}
              onChangeText={(text) => setFormFields({ ...address, state: text })}
            />
            <TextInput
              placeholder="Pincode*"
              style={styles.input}
              value={address.postalCode} maxLength={6}
              onChangeText={(text) => setFormFields({ ...address, postalCode: text })}
              keyboardType="numeric"
            />
            {!loading && <Pressable style={[styles.button, styles.submitButton]} onPress={handleAddAddress}>
              <Text style={styles.buttonText}>Add Address</Text>
            </Pressable>}
            {loading && <Pressable style={[styles.buttonLoading, styles.submitButtonloading]} >
              <ActivityIndicator size={40} color={'white'} />
            </Pressable>}
          </View>
        )}

        {/* Display name, phone, latitude, and longitude if Auto Fetch mode is active */}
        {!isManualInput && (
          <View style={styles.locationContainer}>
            <TextInput
              placeholder="Full Name*"
              style={styles.input}
              value={address.name}
              onChangeText={(text) => setFormFields({ ...address, name: text })}
            />
            <TextInput
              placeholder="Mobile Number*"
              style={styles.input}
              value={address.mobileNo} maxLength={13}
              onChangeText={(text) => setFormFields({ ...address, mobileNo: text })}
              keyboardType="phone-pad"
            />
            <TextInput
              placeholder="House/Flat No*"
              style={styles.input}
              value={address.houseNo}
              onChangeText={(text) => setFormFields({ ...address, houseNo: text })}
            />
            <TextInput
              placeholder="Street*"
              style={styles.input}
              value={address.street}
              onChangeText={(text) => setFormFields({ ...address, street: text })}
            />
            <TextInput
              placeholder="Landmark*"
              style={styles.input}
              value={address.landmark}
              onChangeText={(text) => setFormFields({ ...address, landmark: text })}
            />
            <TextInput
              placeholder="City*"
              style={styles.input}
              value={address.city}
              onChangeText={(text) => setFormFields({ ...address, city: text })}
            />
            <TextInput
              placeholder="State*"
              style={styles.input}
              value={address.state}
              // onChangeText={(text) => setFormFields({ ...address, state: text })}
            />
            <TextInput
              placeholder="Pincode*"
              style={styles.input}
              value={address.postalCode} maxLength={6}
              // onChangeText={(text) => setFormFields({ ...address, postalCode: text })}
              keyboardType="numeric"
            />
            <Text style={styles.locationText}>Latitude: {address.latitude}</Text>
            <Text style={styles.locationText}>Longitude: {address.longitude}</Text>

            {loading && <Pressable style={[styles.buttonLoading, styles.submitButtonloading]} >
              <ActivityIndicator size={40} color={'white'} />
            </Pressable>}

            {!loading && <Pressable style={[styles.button, styles.submitButton]} onPress={handleSubmitCoordinates}>
              <Text style={styles.buttonText}>Add Address</Text>
            </Pressable>}
            <Text style={{ color: '#273c75', fontSize: 16, marginTop: 15, textAlign: 'center' }}>Use Auto Current Address is best and accurate for delivering orders.</Text>

          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f7f7f7', paddingTop: 25
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#8395a7',
    width: '45%',
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonLoading: {
    flex: 1,
    position: 'absolute',
    padding: 50,
    borderRadius: 8,
    backgroundColor: '#8395a7',
    width: '45%',
    alignItems: 'center',
    top: '30%',
  },
  buttonSelected: {
    backgroundColor: '#2e86de',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginTop: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16, width: "100%"
  },
  locationContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#e7f3ff',
    borderRadius: 8,
    alignItems: 'center',
  },
  locationText: {
    fontSize: 18,
    color: '#005aa8',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#28a745',
    width: '100%',
    marginTop: 15,
  },
  submitButtonloading: {
    backgroundColor: '#0abde3',
    width: '100%',
    marginTop: 15,
  },
});

export default AddressScreen;
