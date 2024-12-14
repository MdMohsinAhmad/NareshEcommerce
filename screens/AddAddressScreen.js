import React, { useCallback, useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Alert,Vibration } from 'react-native';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { UserType } from '../UserContext';
import URL_path from '../URL';

const AddAddressScreen = () => {
  const navigation = useNavigation();
  const [addresses, setAddresses] = useState([]);
  const { userId } = useContext(UserType);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(`${URL_path}/addresses/${userId}`);
      const { addresses } = response.data;
      setAddresses(addresses);
    } catch (error) {
      console.log('Error fetching addresses', error);
    }
  };

  const deleteAddress = async (addressId) => {
    Vibration.vibrate(100);
    try {
      await axios.delete(`${URL_path}/api/user/${userId}/address/${addressId}`);
      Alert.alert('Success', 'Address deleted successfully');
      fetchAddresses(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting address:', error);
      Alert.alert('Error', 'Failed to delete address. Please try again.');
    }
  };

  const confirmDelete = (addressId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteAddress(addressId) },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, [userId])
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Your Addresses</Text>
        <Pressable
          onPress={() => navigation.navigate('Add')}
          style={styles.addAddressButton}
        >
          <Text style={styles.addAddressText}>Add a new address</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#000" />
        </Pressable>

        {addresses?.map((item, index) => (
          <Pressable key={item.id || index} style={styles.addressCard}>
            <View style={styles.addressHeader}>
              <Text style={styles.addressName}>{item.name}</Text>
              <Entypo name="location-pin" size={24} color="red" />
            </View>
            <Text style={styles.addressDetail}>{item.houseNo}, {item.landmark}</Text>
            <Text style={styles.addressDetail}>{item.street}</Text>
            <Text style={styles.addressDetail}>India, {item.state}</Text>
            <Text style={styles.addressDetail}>Phone No: {item.mobileNo}</Text>
            <Text style={styles.addressDetail}>Pin code: {item.postalCode}</Text>

            <View style={styles.buttonContainer}>
              <Pressable
                style={styles.actionButton}
                onPress={() => confirmDelete(item._id)}
              >
                <Text style={{ color: '#fff' }}>Remove</Text>
              </Pressable>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    marginTop: 50,
    backgroundColor: '#F5F5F5',
  },
  container: {
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginHorizontal: 10,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFC72C',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 10,
    elevation: 1,
  },
  addAddressText: {
    fontWeight: 'bold',
    color: '#000',
  },
  addressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    padding: 15,
    marginVertical: 10,
    elevation: 2,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  addressName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  addressDetail: {
    fontSize: 14,
    color: '#34495E',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: '#d63031',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: '#D0D0D0',
    alignItems: 'center',
    color: '#fff',
  },
});

export default AddAddressScreen;
