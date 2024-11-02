import {
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as Location from 'expo-location';
// import { AntDesign } from '@expo/vector-icons';
// import EvilIcons from '@expo/vector-icons/EvilIcons';
// import Entypo from '@expo/vector-icons/Entypo';
// import { Ionicons } from '@expo/vector-icons';
//  import { Entypo } from '@expo/vector-icons';
// import FontAwesome from '@expo/vector-icons/FontAwesome';
// import { MaterialIcons } from '@expo/vector-icons';
import { SliderBox } from 'react-native-image-slider-box';
import React,{ useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import ProductItem from '../components/ProductItem';
// import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
// import { BottomModal, ModalContent, SlideAnimation } from 'react-native-modals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserType } from '../UserContext';
import jwt_decode from 'jwt-decode';

const HomeScreen = () => {
 

  const images = [
    'https://www.shutterstock.com/image-vector/3d-liquid-yogurt-drink-ad-260nw-2131689241.jpg',
    'https://www.shutterstock.com/image-vector/3d-fresh-milk-ad-template-260nw-2120388287.jpg',
    'https://www.shutterstock.com/image-vector/3d-milk-farm-product-ad-600nw-2473341937.jpg',
  ];


  const [products, setProducts] = useState([]);

  const navigation = useNavigation();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [open, setOpen] = useState(false);
  // const [category, setCategory] = useState('jewelery');
  const [bars, setBars] = useState(false)



  // handle onpress bars
  const handleBars = () => {
    setBars(!bars)
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://fakestoreapi.com/products');
        setProducts(response.data);
      } catch (error) {
        console.log('error message', error);
      }
    };
    fetchData();
  }, []);

  const onGenderOpen = useCallback(() => {
    setCompanyOpen(false);
  }, []);

  const cart = useSelector((state) => state.cart.cart);
  const [modalVisible, setModalVisible] = useState(false);
  const { userId, setUserId } = useContext(UserType);

  useEffect(() => {
    if (userId) {
      fetchAddresses();
    }
  }, [userId, modalVisible]);

  const [getproducts, setGetProducts] = useState([])

  const fetchProducts = async () => {
    const response = await axios.get('http://192.168.31.155:8800/api/products');
    setGetProducts(response.data);
  };


  useEffect(() => {
    fetchProducts()
  }, [userId])

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `http://192.168.31.155:8800/addresses/${userId}`
      );
      const { addresses } = response.data;
      setAddresses(addresses);
    } catch (error) {
      console.log('Error', error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('authToken');
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };
    fetchUser();
  }, []);

  // get current location
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState({})

  useEffect(() => {
    getLocation()
  }, [])
  const getLocation = async () => {
    // Request permissions
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission Denied', 'Location access is needed to fetch your current location.');
      return;
    }

    // Get location
    const currentLocation = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = currentLocation.coords;

    // Reverse geocode to get address
    const [result] = await Location.reverseGeocodeAsync({ latitude, longitude });

    if (result) {
      // Conditionally build the address
      const street = result.street ? result.street : '';
      const city = result.city ? result.city : '';
      const region = result.region ? result.region : '';
      const country = result.country ? result.country : '';
      const postalCode = result.postalCode ? result.postalCode : '';

      const formattedAddress = `${street ? street + ', ' : ''}${city}${city && region ? ', ' : ''}${region}${region && country ? ', ' : ''}${country}${postalCode ? ' - ' + postalCode : ''}`;
      // console.log(city)
      setAddress(formattedAddress);
      setPincode({ postalCode, city })
    } else {
      alert("Error", "Unable to retrieve address.");
    }
  };

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <SafeAreaView
          style={{
            paddingTop: Platform.OS === 'android' ? 30 : 10,
            flex: 1,
            backgroundColor: '#ececec',
          }}
        >
          <ScrollView showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>


            {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {list.map((item, index) => (
                <Pressable
                  key={index}
                  style={{
                    marginRight: 10,
                    marginLeft: 10,
                    marginBottom: 10,
                    marginTop: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Image
                    source={{ uri: item?.image }}
                    style={{ width: 50, height: 50, resizeMode: 'contain' }}
                  />
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 12,
                      fontWeight: '500',
                      marginTop: 5,
                    }}
                  >
                    {item?.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView> */}
            <SliderBox
              images={images}
              autoPlay
              circleLoop
              dotColor={'#13274F'}
              inactiveDotColor="#90A4AE"
              imageComponentStyle={{ width: '99%' }}
            />

            

            <View
              style={{
                marginHorizontal: 10,
                marginTop: 20,
                width: '100%',
                marginBottom: open ? 50 : 15,
              }}
            >
            <Text style={{fontSize:18,fontWeight:'bold',textAlign:'center',color:'gray'}}>Top Products</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',justifyContent:'space-evenly',
                flexWrap: 'wrap',
              }}
            >

              {getproducts.map(getproducts => (
                <ProductItem key={getproducts._id} product={getproducts} />
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      </ScrollView>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
