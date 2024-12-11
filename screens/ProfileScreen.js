import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, FontAwesome5, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ProfileScreen = () => {
  const navigation = useNavigation();

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
    
    <ImageBackground source={require('../assets/pic2.png')} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome to Dashboard</Text>
      </View>

      <View style={styles.cardContainer}>
        <Pressable
          onPress={() => navigation.navigate('yourOrder')}
          style={styles.card}
        >
          <FontAwesome5 name="box-open" size={36} color="#0984e3" />
          <Text style={styles.cardText}>Your Orders</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('yourAccount')}
          style={styles.card}
        >
          <AntDesign name="user" size={36} color="#6c5ce7" />
          <Text style={styles.cardText}>Your Account</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.replace('Main')}
          style={styles.card}
        >
          <MaterialIcons name="shopping-cart" size={36} color="#e17055" />
          <Text style={styles.cardText}>Buy Again</Text>
        </Pressable>

        <Pressable
          onPress={logout}
          style={[styles.card, styles.logoutCard]}
        >
          <AntDesign name="logout" size={36} color="#d63031" />
          <Text style={styles.cardText}>Logout</Text>
        </Pressable>
      </View>
      <View>
      </View>
        <View style={{height:200,width:300,}}/>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
    padding: 20
  },
  header: {
    marginBottom: 30,marginTop:30
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d3436',
    textAlign: 'center',
  },
  cardContainer: {
    flex:1,
    display:'flex',flexDirection:'column',
    justifyContent: 'space-between',
    gap: 15,alignItems:'center',height:'100%'
  },
  card: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  logoutCard: {
    backgroundColor: '#ffeaea',marginBottom:20
  },
  cardText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});

export default ProfileScreen;
