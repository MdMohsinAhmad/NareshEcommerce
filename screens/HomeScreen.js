import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,Dimensions 
} from 'react-native';
import * as Location from 'expo-location';
import { SliderBox } from 'react-native-image-slider-box';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductItem from '../components/ProductItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import URL_path from '../URL'

const HomeScreen = () => {
  const images = [
    'https://www.shutterstock.com/image-vector/3d-liquid-yogurt-drink-ad-260nw-2131689241.jpg',
    'https://www.shutterstock.com/image-vector/3d-fresh-milk-ad-template-260nw-2120388287.jpg',
    'https://www.shutterstock.com/image-vector/3d-milk-farm-product-ad-600nw-2473341937.jpg',
  ];
  const { width } = Dimensions.get('window');  // To make the slider responsive

  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${URL_path}/api/products`);
      setProducts(response.data);
    } catch (error) {
      console.log('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('authToken');
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
    };
    fetchUser();
  }, []);

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      <SafeAreaView style={styles.container}>
        <SliderBox
          images={images}
          autoplay
          circleLoop
          dotColor={'#13274F'}
          inactiveDotColor="#90A4AE"
          imageComponentStyle={styles.imageComponentStyle}
          sliderBoxHeight={200}
        />
        <View style={styles.topProductsContainer}>
          <Text style={styles.topProductsTitle}>Top Products</Text>
        </View>
        <View style={styles.productList}>
          {products.map((product) => (
            <ProductItem key={product._id} product={product} />
          ))}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? 30 : 10,
    flex: 1,
    backgroundColor: '#ececec',
  },
  topProductsContainer: {
    marginHorizontal: 10,
    marginTop: 20,
    width: '100%',
    marginBottom: 15,
  },
  topProductsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'gray',
  },
  productList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
  }, imageComponentStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});
