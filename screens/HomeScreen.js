import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  RefreshControl,
  Dimensions,
  Pressable,
  Image,
  Text,
  ActivityIndicator,
} from 'react-native';
import { SliderBox } from 'react-native-image-slider-box';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductItem from '../components/ProductItem';

import URL_path from '../URL';

const HomeScreen = () => {
  const images = [
    'https://www.shutterstock.com/image-vector/3d-liquid-yogurt-drink-ad-260nw-2131689241.jpg',
    'https://www.shutterstock.com/image-vector/3d-fresh-milk-ad-template-260nw-2120388287.jpg',
    'https://www.shutterstock.com/image-vector/3d-milk-farm-product-ad-600nw-2473341937.jpg',
  ];
  const { width } = Dimensions.get('window');

  const [products, setProducts] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for filtering

  // Fetch products from the API
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

  useEffect(() => {
    setFilteredItems(products);
  }, [products]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  // Function to filter items based on name
  const filterItems = async (category) => {
    setLoading(true); // Start loading when filter is applied
    if (category === 'All') {
      setFilteredItems(products);
    } else {
      const result = products.filter((product) => product.category === category);
      setFilteredItems(result);
    }
    setLoading(false); // Stop loading after filter is applied
  };


  

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

        <ScrollView horizontal style={styles.topProductsContainer} showsHorizontalScrollIndicator={false}>
          <View style={styles.categoryButtonsContainer}>
            <Pressable onPress={() => filterItems('All')} style={styles.categoryButton}>
              <Image source={require('../assets/order.png')} style={styles.categoryIcon} />
              <Text style={styles.categoryText}>All Items</Text>
            </Pressable>
            <Pressable onPress={() => filterItems('Sweet items')} style={styles.categoryButton}>
              <Image source={require('../assets/sweets.png')} style={styles.categoryIcon} />
              <Text style={styles.categoryText}>Sweets</Text>
            </Pressable>
            <Pressable onPress={() => filterItems('Milk')} style={styles.categoryButton}>
              <Image source={require('../assets/milk.png')} style={styles.categoryIcon} />
              <Text style={styles.categoryText}>Milk</Text>
            </Pressable>
            <Pressable onPress={() => filterItems('Groceries')} style={styles.categoryButton}>
              <Image source={require('../assets/groceries.png')} style={styles.categoryIcon} />
              <Text style={styles.categoryText}>Groceries</Text>
            </Pressable>
            <Pressable onPress={() => filterItems('Cool drinks')} style={styles.categoryButton}>
              <Image source={require('../assets/soda.png')} style={styles.categoryIcon} />
              <Text style={styles.categoryText}>Drinks</Text>
            </Pressable>
            <Pressable onPress={() => filterItems('Fruits')} style={styles.categoryButton}>
              <Image source={require('../assets/fruits.png')} style={styles.categoryIcon} />
              <Text style={styles.categoryText}>Fruits</Text>
            </Pressable>
            <Pressable onPress={() => filterItems('Vegetables')} style={styles.categoryButton}>
              <Image source={require('../assets/vegetable.png')} style={styles.categoryIcon} />
              <Text style={styles.categoryText}>Vegetables</Text>
            </Pressable>
          </View>
        </ScrollView>

        {loading ? ( // Show loading indicator if loading is true
          <ActivityIndicator size="large" color="#13274F" style={styles.loadingIndicator} />
        ) : (
          <View style={styles.productList}>
            {filteredItems.map((product) => (
              <ProductItem key={product._id} product={product} />
            ))}
          </View>
        )}
      </SafeAreaView>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? 1 : 10,
    flex: 1,
    backgroundColor: '#ececec',
  },
  topProductsContainer: {
    marginHorizontal: 10,
    marginTop: 20,
    marginBottom: 15,
  },
  categoryButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  categoryButton: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  categoryIcon: {
    height: 40,
    width: 40,
  },
  categoryText: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
  },
  productList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
  },
  imageComponentStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'cover',
  },
  loadingIndicator: {
    marginTop: 20,
    alignSelf: 'center',
  },
});
