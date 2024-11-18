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
  Dimensions, FlatList, TouchableOpacity
} from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import URL_path from '../URL';
import Carousel from 'react-native-snap-carousel';

const HomeScreen = ({ navigation }) => {
  const { width } = Dimensions.get('window');

  const [products, setProducts] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [restaurants, setRestaurants] = useState([]);
  console.log(restaurants)
  const [selectedCategory, setSelectedCategory] = useState('All'); // Track selected category
  const restaurants = [
    {
      _id: "1",
      name: "Taj Drive",
      address: "Moinabad",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZ7ma8M0MI7yL5V7i8PzSwNmqCSUDzSy1QEA&s",
      rating: 4.5,
    },
    {
      _id: "2",
      name: "Palm Grove",
      address: "Banjara Hills",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLwTWixFrsbbEYkjTVjuAHy4hVrpgtzy5RLg&s",
      rating: 4.2,
    }, {
      _id: "4",
      name: "Taj Drive",
      address: "Moinabad",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZ7ma8M0MI7yL5V7i8PzSwNmqCSUDzSy1QEA&s",
      rating: 4.5,
    },
  ];

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

  // fetch restaurant 

  const [restaurant, setRestaurant] = useState([]);

  useEffect(() => {
    axios.get('https://freshandfreshbackend-j98njjva.b4a.run/api/restaurants')
      .then((response) => {
        setRestaurant(response.data);
      })
      .catch((error) => {
        console.error('Error fetching restaurants:', error);
      });
  }, []);



  const renderItem = ({ item }) => {
    return (
      <View style={styles.sliderItem}>
        <Image source={{ uri: item }} style={styles.image} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingVertical: 12 }}>
          <Carousel
            data={images}
            renderItem={renderItem}
            sliderWidth={width}
            itemWidth={width - 60}
            inactiveSlideOpacity={0.7}
            inactiveSlideScale={0.95}
            loop={true}
            autoplay={true}
            autoplayInterval={2000}
            autoplayDelay={1000}
            enableSnap={true}
          />

        </View>
        <View style={styles.categoryButtonsContainer}>
          {[
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
        <View style={{ borderStyle: 'dashed', borderWidth: 1, borderColor: 'gray', marginHorizontal: 58, }}></View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: '#fff' }}
        >
          <Text style={{ fontFamily: 'sans', marginLeft: 12, fontSize: 20, fontWeight: 'bold', color: 'gray', marginTop: 12 }}>Hotels and Restaurant Food</Text>
          <FlatList
            data={restaurant}
            keyExtractor={(item) => item._id.toString()} // Ensure unique keys
            horizontal
            showsHorizontalScrollIndicator={false} // Hide the horizontal scroll indicator
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('restaurants', { restaurantId: item })}
              >
                <Image source={{ uri: item.image }} style={styles.image} />
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.address}>{item.address}</Text>
                <Text style={styles.rating}>Rating: {item.rating} ⭐</Text>
              </TouchableOpacity>
            )}
          />
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ececec',
    paddingTop: Platform.OS === 'android' ? 1 : 0,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 10, // Add spacing between cards
    width: 280, // Fixed width for each card
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    // marginBottom: 10,
  }, name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  address: {
    fontSize: 14,
    color: '#777',
    marginVertical: 5,
  },
  rating: {
    fontSize: 12,
    color: '#555',
  },
  categoryButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10, backgroundColor: '#fff', elevation: 5
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
    borderRadius: 20,
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
  sliderItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    // padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // For Android shadow
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 170,
    borderRadius: 10,
    // marginBottom: 20,
  },
});
