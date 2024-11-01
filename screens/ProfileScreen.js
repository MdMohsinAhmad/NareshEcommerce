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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flex: 1, alignItems: 'center',justifyContent:'center',width:350 }}>
        <Text style={{ color: 'black', fontWeight: 'bold',fontSize:19,fontWeight:'bold' }}>Dashboard</Text>
      </View>
            ),
      headerStyle: {
        backgroundColor: 'transparent',
      },
      headerRight: () => (
        <View
          style={{
            display:'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            marginRight: 12,fontSize:13
          }}
        >
          {/* Add any buttons or icons here */}
        </View>
      ),
    });
  }, [navigation]);

  // const [user, setUser] = useState({});
  // useEffect(() => {
  //   const fetchUserProfile = async () => {
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:8800/profile/${userId}`
  //       );
  //       const { user } = response.data;
  //       setUser(user);
  //       console.log(user)
  //     } catch (error) {
  //       console.log('error', error);
  //     }
  //   };

  //   fetchUserProfile();
  // }, []);

  const logout = () => {
    AsyncStorage.removeItem('authToken')
    clearAuthToken();
  };
  const clearAuthToken = async () => {
    await AsyncStorage.removeItem('authToken');
    console.log('auth token cleared');
    navigation.replace('Login');
  };

  // useEffect(() => {
  //   const fetchOrders = async () => {
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:8800/orders/${userId}`
  //       );
  //       const orders = response.data.orders;
  //       setOrders(orders);

  //       setLoading(false);
  //     } catch (error) {
  //       console.log('error', error);
  //     }
  //   };

  //   fetchOrders();
  // }, []);
  return (

    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Welcome</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 }}>
        <Pressable onPress={() => navigation.navigate('yourOrder')} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Your orders</Text>
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

      {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {loading ? (
          <Text></Text>
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <Pressable style={styles.orderContainer} key={order._id}>
              {order.products.slice(0, 1)?.map((product) => (
                <View style={{ marginVertical: 10 }} key={product._id}>
                  <Image source={{ uri: product.image }} style={styles.productImage} />
                </View>
              ))}
            </Pressable>
          ))
        ) : (
          <Text style={styles.noOrdersText}>No orders found</Text>
        )}
      </ScrollView> */}
    </ScrollView>
  );


};

// export default ProfileScreen;

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
  orderContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    borderRadius: 10,
    overflow: 'hidden',
  },
  noOrdersText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ProfileScreen;

