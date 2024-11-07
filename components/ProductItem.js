import { Image, Pressable, StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, decrementQuantity, incrementQuantity, removeFromCart } from '../redux/CartReducer';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ProductItem = ({ product }) => {
  const [addedToCart, setAddedToCart] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const cart = useSelector((state) => state.cart.cart);
  const cartItem = cart.find((item) => item._id === product._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  useEffect(() => {
    if (quantity === 0) {
      setAddedToCart(false);
      return;
    }
  }, [quantity]);

  const addItemToCart = (product) => {
    setAddedToCart(true);
    dispatch(addToCart(product));
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

  return (
    <ScrollView>

      <Pressable style={quantity > 0 ? styles.containerAdded : styles.container} key={product._id}>
        <TouchableOpacity onPress={() => navigation.navigate('Info', { product })}>
          <Image source={{ uri: product?.image }} style={styles.image} resizeMode="contain" />

          <Text style={styles.title} numberOfLines={1}>
            {product?.title}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {product?.description}
          </Text>
          <Text style={styles.description}>Quantity : {product.Quantity}</Text>
          <View style={styles.priceContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.rupee}>₹ </Text>
              <Text style={styles.rating}>
                {product?.MRP === null ? product.price + 12 : product.MRP}
              </Text>
            </View>
            <Text style={styles.price}>₹{product?.price}</Text>
          </View>
        </TouchableOpacity>

        {quantity < 1 && !addedToCart && (
          <Pressable onPress={() => addItemToCart(product)} style={styles.button} disabled={addedToCart}>
            <Text style={styles.buttonText}>Add to Cart</Text>
          </Pressable>
        )}

        {quantity > 0 && (
          <Pressable style={styles.quantityContainer}>
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
          </Pressable>
        )}
      </Pressable>
    </ScrollView>
  );
};

export default ProductItem;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f2f1ef',
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 5,
    borderRadius: 10,
    width: 180,
    paddingVertical: 10,
    height: 330,
  },
  containerAdded: {
    marginVertical: 10,
    alignItems: 'center',
    backgroundColor: '#e0f7fa',
    shadowColor: '#00acc1',
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 15,
    elevation: 10,
    borderRadius: 10,
    width: 180,
    paddingVertical: 10,
    height: 330,
    borderColor: '#00bcd4',
    borderWidth: 2,
  },
  image: {
    width: 150,
    height: 120,
    borderRadius: 10,
  },
  title: {
    width: 150,
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  description: {
    width: 150,
    marginTop: 5,
    color: '#555', textAlign: 'center'
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    justifyContent: 'space-evenly',
    width: '100%',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00b894',
  },
  rupee: {
    color: '#b2bec3',
    fontWeight: 'bold',
    marginRight: -4,
    textDecorationLine: 'line-through',
  },
  rating: {
    color: '#b2bec3',
    fontWeight: 'bold',
    textDecorationLine: 'line-through', fontSize: 15
  },
  button: {
    backgroundColor: '#FFC72C',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    position: 'absolute',
    bottom: 15,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#333',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 7,
    backgroundColor: '#f5f5f5',
  },
  iconContainer: {
    backgroundColor: '#fab1a0',
    padding: 7,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  iconContainerAdd: {
    backgroundColor: '#00b894',
    padding: 7,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  quantityText: {
    backgroundColor: 'white',
    paddingHorizontal: 18,
    fontSize: 25,
    paddingVertical: 2,
    fontWeight: 'bold',
    borderRadius: 10,
    color: '#333', marginHorizontal: 5
  },
});
