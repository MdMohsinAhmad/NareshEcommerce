import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useLayoutEffect, useState, useEffect, useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { UserType } from '../UserContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import URL_path from '../URL';

const YourAccount = () => {
  const navigation = useNavigation();
  const { userId } = useContext(UserType);
  const [user, setUser] = useState();
 
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Account Profile',
      headerStyle: {
        backgroundColor: '#007AFF',
        shadowColor: 'transparent',
      },
      headerTintColor: 'white',
    });
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${URL_path}/profile/${userId}`);
        const { user } = response.data;
        setUser(user);
        // console.log(user)
      } catch (error) {
        console.log('Error fetching profile:', error);
      }
    };
    // userInformation()
    fetchUserProfile();
  }, [userId]);


  const logout = () => {
    AsyncStorage.removeItem('authToken')
    clearAuthToken();
  };
  const clearAuthToken = async () => {
    await AsyncStorage.removeItem('authToken');
    console.log('auth token cleared');
    navigation.replace('Login');
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: user?.avatar || 'https://static.vecteezy.com/system/resources/thumbnails/011/675/374/small/man-avatar-image-for-profile-png.png' }}
          style={styles.avatar}
        />
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Ionicons name="person-circle-outline" size={24} color="#007AFF" />
          <Text style={styles.infoText}>Username: {user?.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={24} color="#007AFF" />
          <Text style={styles.infoText}>Email: {user?.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={24} color="#007AFF" />
          <Text style={styles.infoText}>Phone: {user?.mobile || 'N/A'}</Text>
        </View>
      </View>

      {/* <Pressable style={styles.actionButton}>
        <Text style={styles.actionButtonText}>Edit Profile</Text>
      </Pressable> */}
      <Pressable style={[styles.actionButton, styles.logoutButton]} onPress={logout}>
        <Text style={styles.actionButtonText}>Logout</Text>
      </Pressable>
    </ScrollView>
  );
};

export default YourAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#007AFF',resizeMode:'contain'
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  infoContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    marginHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    shadowColor: '#FF3B30',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
