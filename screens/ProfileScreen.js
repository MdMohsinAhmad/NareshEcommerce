import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useLayoutEffect, } from 'react';
import { useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const navigation = useNavigation();


  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerTitle: () => (
  //       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: 350 }}>
  //         <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 19 }}>Dashboard</Text>
  //       </View>
  //     ),
  //     headerStyle: {
  //       backgroundColor: 'transparent',
  //     },
  //     headerRight: () => (
  //       <View
  //         style={{
  //           display: 'flex',
  //           flexDirection: 'row',
  //           alignItems: 'center',
  //           justifyContent: 'center',
  //           gap: 6,
  //           marginRight: 12, fontSize: 13
  //         }}
  //       >
  //       </View>
  //     ),
  //   });
  // }, [navigation]);


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
      <Text style={styles.headerText}>Welcome to dashboard</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 }}>
        <Pressable onPress={() => navigation.navigate('yourOrder')} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Your Orders</Text>
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 }}>
        <Pressable onPress={() => navigation.navigate('yourAccount')} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Your Account</Text>
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 }}>
        <Pressable style={styles.actionButton} onPress={() => navigation.replace('Main')}>
          <Text style={styles.actionButtonText}>Buy Again</Text>
        </Pressable>

      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 }}>
        <Pressable onPress={logout} style={{
          padding: 15,
          backgroundColor: '#d63031',
          borderRadius: 14,
          flex: 1,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          elevation: 4, height: 140, alignItems: 'center', justifyContent: 'center'
        }}>
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
    marginVertical: 40,
  },
  actionButton: {
    padding: 15,
    backgroundColor: '#0984e3',
    borderRadius: 14,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4, height: 140, alignItems: 'center', justifyContent: 'center'
  },
  actionButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold', fontSize: 20
  },
});

export default ProfileScreen;
