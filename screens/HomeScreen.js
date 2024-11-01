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
  const list = [
    {
      id: '0',
      image: 'https://m.media-amazon.com/images/I/41EcYoIZhIL._AC_SY400_.jpg',
      name: 'Home',
    },
    {
      id: '1',
      image:
        'https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/blockbuster.jpg',
      name: 'Deals',
    },
    {
      id: '3',
      image:
        'https://images-eu.ssl-images-amazon.com/images/I/31dXEvtxidL._AC_SX368_.jpg',
      name: 'Electronics',
    },
    {
      id: '4',
      image:
        'https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/All_Icons_Template_1_icons_01.jpg',
      name: 'Mobiles',
    },
    {
      id: '5',
      image:
        'https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/music.jpg',
      name: 'Music',
    },
    {
      id: '6',
      image: 'https://m.media-amazon.com/images/I/51dZ19miAbL._AC_SY350_.jpg',
      name: 'Fashion',
    },
  ];

  const images = [
    'https://www.shutterstock.com/image-vector/3d-liquid-yogurt-drink-ad-260nw-2131689241.jpg',
    'https://www.shutterstock.com/image-vector/3d-fresh-milk-ad-template-260nw-2120388287.jpg',
    'https://www.shutterstock.com/image-vector/3d-milk-farm-product-ad-600nw-2473341937.jpg',
  ];

  // const deals = [
  //   {
  //     id: '20',
  //     title: 'OnePlus Nord CE 3 Lite 5G (Pastel Lime, 8GB RAM, 128GB Storage)',
  //     oldPrice: 25000,
  //     price: 19000,
  //     image: 'https://5.imimg.com/data5/XV/LE/MB/SELLER-87956677/sudeshna-buffalo-milk-packet-11-jpg.jpg',
  //     carouselImages: [
  //       'https://m.media-amazon.com/images/I/61QRgOgBx0L._SX679_.jpg',
  //       'https://m.media-amazon.com/images/I/61uaJPLIdML._SX679_.jpg',
  //       'https://m.media-amazon.com/images/I/510YZx4v3wL._SX679_.jpg',
  //       'https://m.media-amazon.com/images/I/61J6s1tkwpL._SX679_.jpg',
  //     ],
  //     color: 'Stellar Green',
  //     size: '6 GB RAM 128GB Storage',
  //   },
  //   {
  //     id: '30',
  //     title:
  //       'Samsung Galaxy S20 FE 5G (Cloud Navy, 8GB RAM, 128GB Storage) with No Cost EMI & Additional Exchange Offers',
  //     oldPrice: 74,
  //     price: 26,
  //     image: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=900/app/assets/products/sliding_images/jpeg/8f6bfafc-ad44-422a-8e96-7e2d2994012a.jpg?ts=1707998856',
  //     carouselImages: [
  //       'https://m.media-amazon.com/images/I/81vDZyJQ-4L._SY879_.jpg',
  //       'https://m.media-amazon.com/images/I/61vN1isnThL._SX679_.jpg',
  //       'https://m.media-amazon.com/images/I/71yzyH-ohgL._SX679_.jpg',
  //       'https://m.media-amazon.com/images/I/61vN1isnThL._SX679_.jpg',
  //     ],
  //     color: 'Cloud Navy',
  //     size: '8 GB RAM 128GB Storage',
  //   },
  //   {
  //     id: '40',
  //     title:
  //       'Samsung Galaxy M14 5G (ICY Silver, 4GB, 128GB Storage) | 50MP Triple Cam | 6000 mAh Battery | 5nm Octa-Core Processor | Android 13 | Without Charger',
  //     oldPrice: 160,
  //     price: 140,
  //     image: 'https://www.smc-madhusudan.co.in/cdn/shop/files/FULLCREAMMILK6LTR.jpg?v=1714569442&width=3001',
  //     carouselImages: [
  //       'https://m.media-amazon.com/images/I/817WWpaFo1L._SX679_.jpg',
  //       'https://m.media-amazon.com/images/I/81KkF-GngHL._SX679_.jpg',
  //       'https://m.media-amazon.com/images/I/61IrdBaOhbL._SX679_.jpg',
  //     ],
  //     color: 'Icy Silver',
  //     size: '6 GB RAM 64GB Storage',
  //   },
  //   {
  //     id: '40',
  //     title:
  //       'realme narzo N55 (Prime Blue, 4GB+64GB) 33W Segment Fastest Charging | Super High-res 64MP Primary AI Camera',
  //     oldPrice: 60,
  //     price: 50,
  //     image: 'https://image1.jdomni.in/product/09082021/B6/40/95/69E61DFEBC8F07440F282561BF_1628449240817.jpg',
  //     carouselImages: [
  //       'https://m.media-amazon.com/images/I/41Iyj5moShL._SX300_SY300_QL70_FMwebp_.jpg',
  //       'https://m.media-amazon.com/images/I/61og60CnGlL._SX679_.jpg',
  //       'https://m.media-amazon.com/images/I/61twx1OjYdL._SX679_.jpg',
  //     ],
  //   },
  // ];

  // const offers = [
  //   {
  //     id: '0',
  //     title:
  //       'Oppo Enco Air3 Pro True Wireless in Ear Earbuds with Industry First Composite Bamboo Fiber, 49dB ANC, 30H Playtime, 47ms Ultra Low Latency,Fast Charge,BT 5.3 (Green)',
  //     offer: '72% off',
  //     oldPrice: 7500,
  //     price: 4500,
  //     image:
  //       'https://m.media-amazon.com/images/I/61a2y1FCAJL._AC_UL640_FMwebp_QL65_.jpg',
  //     carouselImages: [
  //       'https://m.media-amazon.com/images/I/61a2y1FCAJL._SX679_.jpg',
  //       'https://m.media-amazon.com/images/I/71DOcYgHWFL._SX679_.jpg',
  //       'https://m.media-amazon.com/images/I/71LhLZGHrlL._SX679_.jpg',
  //       'https://m.media-amazon.com/images/I/61Rgefy4ndL._SX679_.jpg',
  //     ],
  //     color: 'Green',
  //     size: 'Normal',
  //   },
  //   {
  //     id: '1',
  //     title:
  //       'Fastrack Limitless FS1 Pro Smart Watch|1.96 Super AMOLED Arched Display with 410x502 Pixel Resolution|SingleSync BT Calling|NitroFast Charging|110+ Sports Modes|200+ Watchfaces|Upto 7 Days Battery',
  //     offer: '40%',
  //     oldPrice: 7955,
  //     price: 3495,
  //     image: 'https://m.media-amazon.com/images/I/41mQKmbkVWL._AC_SY400_.jpg',
  //     carouselImages: [
  //       'https://m.media-amazon.com/images/I/71h2K2OQSIL._SX679_.jpg',
  //       'https://m.media-amazon.com/images/I/71BlkyWYupL._SX679_.jpg',
  //       'https://m.media-amazon.com/images/I/71c1tSIZxhL._SX679_.jpg',
  //     ],
  //     color: 'black',
  //     size: 'Normal',
  //   },
  //   {
  //     id: '2',
  //     title: 'Aishwariya System On Ear Wireless On Ear Bluetooth Headphones',
  //     offer: '40%',
  //     oldPrice: 7955,
  //     price: 3495,
  //     image: 'https://m.media-amazon.com/images/I/41t7Wa+kxPL._AC_SY400_.jpg',
  //     carouselImages: ['https://m.media-amazon.com/images/I/41t7Wa+kxPL.jpg'],
  //     color: 'black',
  //     size: 'Normal',
  //   },
  //   {
  //     id: '3',
  //     title:
  //       'Fastrack Limitless FS1 Pro Smart Watch|1.96 Super AMOLED Arched Display with 410x502 Pixel Resolution|SingleSync BT Calling|NitroFast Charging|110+ Sports Modes|200+ Watchfaces|Upto 7 Days Battery',
  //     offer: '40%',
  //     oldPrice: 24999,
  //     price: 19999,
  //     image: 'https://m.media-amazon.com/images/I/71k3gOik46L._AC_SY400_.jpg',

  //     carouselImages: [
  //       'https://m.media-amazon.com/images/I/41bLD50sZSL._SX300_SY300_QL70_FMwebp_.jpg',
  //       'https://m.media-amazon.com/images/I/616pTr2KJEL._SX679_.jpg',
  //       'https://m.media-amazon.com/images/I/71wSGO0CwQL._SX679_.jpg',
  //     ],
  //     color: 'Norway Blue',
  //     size: '8GB RAM, 128GB Storage',
  //   },
  // ];

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
