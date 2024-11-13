import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  RefreshControl,
  Pressable,
  Image,
  Text,

} from 'react-native';
import { SliderBox } from 'react-native-image-slider-box';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import URL_path from '../URL';

const HomeScreen = ({ navigation }) => {

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
  const [images, setImages] = useState([])
  const fetchImages = async () => {
    try {
      const response = await axios.get('https://freshandfreshbackend-j98njjva.b4a.run/api/sliderimages');
      const imageUrls = response.data.map(item => item.image);
      setImages(imageUrls);
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('Error fetching images');
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

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
        <View style={styles.categoryButtonsContainer}>
          {[
            // { label: 'All Items', icon: require('../assets/order.png'), category: 'All' },
            { label: 'Sweets', icon: require('../assets/sweets.png'), category: 'Sweet items' },
            { label: 'Milk ', icon: require('../assets/milk.png'), category: 'Milk' },
            { label: 'Cool Drinks', icon: require('../assets/soda.png'), category: 'Cool drinks' },
            { label: 'Fresh Fruits', icon: require('../assets/fruits.png'), category: 'Fruits' },
            { label: 'Vegetables', icon: require('../assets/vegetable.png'), category: 'Vegetables' },
            { label: 'Chicken & Meat', icon: require('../assets/meat.png'), category: 'meat' },
            { label: 'Dry fruits & seads', icon: require('../assets/dry fruits.png'), category: 'dry fruits' },
            { label: 'Gree and Oils', icon: require('../assets/ghee and oils.png'), category: 'Ghee and oils' },
            { label: 'Dal,Atta & More', icon: require('../assets/dal.png'), category: 'Dal atta' },
            { label: 'Suji,Poha & More', icon: require('../assets/poha.jpg'), category: 'Suji Poha' },
            { label: 'Masala & Spices', icon: require('../assets/masala.png'), category: 'Masala and Spices' },
            { label: 'Salt & Sugar', icon: require('../assets/salt sugar.png'), category: 'Salt and Sugar' },
            { label: 'Tea &Coffee', icon: require('../assets/tea.png'), category: 'Tea and Coffee' },
            { label: 'Under ₹99 & Below', icon: require('../assets/under99.png'), category: 'Under 99' },
            { label: 'Other', icon: require('../assets/other.png'), category: 'Other' },
       
          ].map((item, index) => (
            <Pressable
              key={index}
              onPress={() => navigation.navigate('selecteditems', item.category)}
              style={[
                styles.categoryButton,
              ]}
            >
              <Image source={item.icon} style={styles.categoryIcon} />
              <Text style={[styles.categoryText, selectedCategory === item.category]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>

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
  categoryButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,backgroundColor:'#fff'
  },
  categoryButton: {
    alignItems: 'center',
    width: '30%', // This ensures three items fit per row
    marginVertical: 10,
  },
  categoryIcon: {
    height: 60,
    width: 60,
    borderRadius: 8,
  },
  categoryText: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
  selectedCategoryButton: {
    padding: 2,
    backgroundColor: '#22a6b3',
    borderRadius: 6,
    color: 'white'
  },
  selectedCategoryText: {
    color: 'white',
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
