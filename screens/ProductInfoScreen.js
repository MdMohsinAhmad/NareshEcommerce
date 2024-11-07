import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, decrementQuantity, incrementQuantity, removeFromCart } from '../redux/CartReducer';
import { AntDesign, Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';

const ProductInfoScreen = ({ route }) => {
  const { product } = route.params;
  const { width } = Dimensions.get('window');
  const navigation = useNavigation();
  const [addedToCart, setAddedToCart] = useState(false);
  const height = (width * 100) / 100;
  const dispatch = useDispatch();
  const [address, setAddress] = useState([]);
  const cart = useSelector((state) => state.cart.cart);
  const cartItem = cart.find((item) => item._id === product._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const addItemToCart = (item) => {
    setAddedToCart(true);
    dispatch(addToCart(item));
  };

  const increaseQuantity = (item) => {
    dispatch(incrementQuantity(item));
  };

  const decreaseQuantity = (item) => {
    if (quantity > 1) {
      dispatch(decrementQuantity(item));
    } else {
      removeItemFromCart(item);
    }
  };

  const removeItemFromCart = (item) => {
    dispatch(removeFromCart(item));
    setAddedToCart(false);
  };

  useEffect(() => {
    if (quantity === 0) {
      setAddedToCart(false);
    }
  }, [quantity]);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission Denied', 'Location access is needed to fetch your current location.');
      return;
    }

    const currentLocation = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = currentLocation.coords;
    const [result] = await Location.reverseGeocodeAsync({ latitude, longitude });

    if (result) {
      setAddress(result);
    } else {
      alert("Error", "Unable to retrieve address.");
    }
  };

  const handleBututton = () => {
    dispatch(addToCart(product));
    navigation.navigate('Cart')
  }

  return (
    <ScrollView style={{ marginTop: 0, flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <Text style={{position:'absolute',zIndex:999,left:12,backgroundColor:'yellow',borderRadius:10,padding:3,top:12, fontWeight: 'bold'}}> {((product.MRP - product.price) * 100 / product.MRP).toFixed(1)}% off</Text>
        <Image source={{ uri: product.image }} style={styles.image} />
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.description} >{product.description}</Text>
      </View>

      <Text style={{ height: 1, borderColor: '#D0D0D0', borderWidth: 1 }} />
      <Text style={{ textAlign: 'left', marginLeft: 20, fontSize: 16, fontWeight: 'bold' }} >Quantity :{product.Quantity}</Text>
      <View style={{ padding: 10 }}>
        <Text style={styles.price}><Text style={{ marginRight: 40, fontSize: 16, }}>MRP : <Text style={{ textDecorationLine: 'line-through', color: 'gray' }}>₹ {product.MRP}</Text></Text> New Price : ₹ <Text>{product.price}</Text> </Text>
        <Text style={styles.deliveryText}>
          Delivery between 6:00 AM to 9:00 AM Or 5:00 PM to 7:00 PM.
        </Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={24} color="black" />
          <Text style={styles.locationText}> Deliver to  {address.city} - {address.postalCode}</Text>
        </View>
      </View>

      {/* <Text style={styles.stockText}>In Stock</Text> */}

      {quantity < 1 && (
        <Pressable onPress={() => addItemToCart(product)} style={styles.addToCartButton}>
          <Text style={styles.buttonText}>
            {addedToCart ? 'Added to Cart' : 'Add to Cart'}
          </Text>
        </Pressable>
      )}

      {quantity > 0 && (
        <View style={styles.quantityContainer}>
          <Pressable onPress={() => decreaseQuantity(product)} style={styles.iconContainer}>
            {quantity > 1 ? (
              <AntDesign name="minus" size={20} color="black" />
            ) : (
              <AntDesign name="delete" size={20} color="red" />
            )}
          </Pressable>
          <Text style={styles.quantityText}>{quantity}</Text>
          <Pressable onPress={() => increaseQuantity(product)} style={styles.iconContainerAdd}>
            <Feather name="plus" size={20} color="white" />
          </Pressable>
        </View>
      )}

      <Pressable onPress={() => { cart.length === 0 ? handleBututton(product) : navigation.navigate('Cart') }} style={styles.buyNowButton}>
        <Text style={styles.buttonText}>Buy Now</Text>
      </Pressable>
    </ScrollView>
  );
};

export default ProductInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: '100%',
    height: 230,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'justify',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0a3d62',
    paddingHorizontal: 10,
    display: 'flex', flexDirection: 'row', justifyContent: 'space-between'
  },
  deliveryText: {
    color: 'green',
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'center',
  },
  locationText: {
    fontSize: 15,
    fontWeight: '500',
  },
  stockText: {
    color: 'green',
    marginHorizontal: 10,
    fontWeight: '500',
  },
  addToCartButton: {
    backgroundColor: '#FFC72C',
    padding: 15,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  quantityContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: '#f5f5f5',
    borderRadius: 10, justifyContent: 'center'
  },
  iconContainer: {
    backgroundColor: '#fab1a0',
    padding: 7,
    borderRadius: 5,
  },
  iconContainerAdd: {
    backgroundColor: '#00b894',
    padding: 7,
    borderRadius: 5,
  },
  quantityText: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    fontSize: 20,
    paddingVertical: 5,
    fontWeight: 'bold',
    marginHorizontal: 10,
    borderRadius: 5,
  },
  buyNowButton: {
    backgroundColor: '#FFAC1C',
    padding: 15,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});
