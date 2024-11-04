import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useLayoutEffect, useState, useEffect, useContext } from 'react';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { UserType } from '../UserContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  // const [orders, setOrders] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});


  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: 350 }}>
          <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 19 }}>Dashboard</Text>
        </View>
      ),
      headerStyle: {
        backgroundColor: 'transparent',
      },
      headerRight: () => (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            marginRight: 12, fontSize: 13
          }}
        >
          {/* Add any buttons or icons here */}
        </View>
      ),
    });
  }, [navigation]);

  // Retrieve user
  const userInfo = async () => {
    try {
      const user = await AsyncStorage.getItem('USER');
      if (user) {
        setUser(JSON.parse(user));
      } else {
        console.log('No user data found');
      }
    } catch (error) {
      console.log('Error retrieving user data:', error);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `http://192.168.31.155:8800/profile/${userId}`
        );
        setUser(response.data.user);
        // console.log(response.data.user);
      } catch (error) {
        console.log('Error fetching user profile:', error);
      }
    };

    userInfo();
    fetchUserProfile();
  }, [userId]);

  const logout = async () => {
    await AsyncStorage.removeItem('authToken');
    clearAuthToken();
  };

  const clearAuthToken = async () => {
    await AsyncStorage.removeItem('authToken');
    console.log('Auth token cleared');
    navigation.replace('Login');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Welcome</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 }}>
        <Pressable onPress={() => navigation.navigate('yourOrder')} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Your Orders</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('yourAccount')} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Your Account</Text>
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 }}>
        <Pressable style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Buy Again</Text>
        </Pressable>

        <Pressable onPress={logout} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Logout</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: '#f7f8fa',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
  },
  actionButton: {
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  actionButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
