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
  FlatList
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

  const [products, setProducts] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All'); // Track selected category

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${URL_path}/api/products`);
      setProducts(response.data);
      setLoading(false);
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

  const filterItems = async (category) => {
    setSelectedCategory(category); // Set the selected category
    setLoading(true);
    if (category === 'All') {
      setFilteredItems(products);
      setLoading(false);
    } else {
      const result = products.filter((product) => product.category === category);
      setFilteredItems(result);
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <SliderBox
          images={images}
          autoplay
          circleLoop
          dotColor={'#13274F'}
          inactiveDotColor="#90A4AE"
          imageComponentStyle={styles.imageComponentStyle}
          sliderBoxHeight={200}
        />
        <ScrollView horizontal style={styles.categoryScroll} showsHorizontalScrollIndicator={false}>
          <View style={styles.categoryButtonsContainer}>
            {[
              { label: 'All Items', icon: require('../assets/order.png'), category: 'All' },
              { label: 'Sweets', icon: require('../assets/sweets.png'), category: 'Sweet items' },
              { label: 'Milk', icon: require('../assets/milk.png'), category: 'Milk' },
              { label: 'Groceries', icon: require('../assets/groceries.png'), category: 'Groceries' },
              { label: 'Drinks', icon: require('../assets/soda.png'), category: 'Cool drinks' },
              { label: 'Fruits', icon: require('../assets/fruits.png'), category: 'Fruits' },
              { label: 'Vegetables', icon: require('../assets/vegetable.png'), category: 'Vegetables' },
            ].map((item, index) => (
              <Pressable
                key={index}
                onPress={() => filterItems(item.category)}
                style={[
                  styles.categoryButton,
                  selectedCategory === item.category && styles.selectedCategoryButton, // Add underline if selected
                ]}
              >
                <Image source={item.icon} style={styles.categoryIcon} />
                <Text style={[styles.categoryText, selectedCategory === item.category && styles.selectedCategoryText]}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {loading ? (
          <ActivityIndicator size="large" color="#13274F" style={styles.loadingIndicator} />
        ) : (
          <View style={styles.productListContainer}>
            <FlatList
              data={filteredItems}
              renderItem={({ item }) => <ProductItem product={item} />}
              keyExtractor={(item) => item._id.toString()}
              numColumns={2}
              scrollEnabled={false} // Disable FlatList scrolling
              initialNumToRender={6} // Adjust based on screen
              getItemLayout={(data, index) => ({ length: 150, offset: 150 * index, index })}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ececec',
    paddingTop: Platform.OS === 'android' ? 10 : 0,
  },
  scrollView: {
    flex: 1,
  },
  categoryScroll: {
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  categoryButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',gap:5
  },
  categoryButton: {
    alignItems: 'center',
    marginLeft: 10,marginRight:6
  },
  categoryIcon: {
    height: 40,
    width: 40,
    borderRadius: 8,
  },
  categoryText: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
  selectedCategoryButton: {
    padding:2,
     backgroundColor:'#22a6b3',borderRadius:6,color:'white'
  },
  selectedCategoryText: {
    color: 'white', // Text color when selected
  },
  imageComponentStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'cover',
  },
  loadingIndicator: {
    marginTop: 40,
    height: 200,
  },
  productListContainer: {
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
});
