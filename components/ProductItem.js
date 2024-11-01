import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/CartReducer';
// Uncomment the next line if you want to use PropTypes
// import PropTypes from 'prop-types';

const ProductItem = ({ product }) => {
  const [addedToCart, setAddedToCart] = useState(false);
  const dispatch = useDispatch();

  const addItemToCart = (item) => {
    setAddedToCart(true);
    dispatch(addToCart(item));

    // Reset the addedToCart state after 1 minute
    setTimeout(() => {
      setAddedToCart(false);
    }, 6000);
  };

  return (
    <Pressable style={styles.container}>
      <Image
        source={{ uri: product?.image }}
        style={styles.image} resizeMode='contain'
      />
      <Text style={styles.title} numberOfLines={1}>
        {product?.title}
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {product?.description}
      </Text>

      <View style={styles.priceContainer}>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <Text style={styles.rupee}>  ₹ </Text>
          <Text style={styles.rating}> {product?.MRP === null ? product.price + 12 : product.MRP} </Text>
        </View>
        <Text style={styles.price}>₹{product?.price}</Text>
      </View>

      <Pressable
        onPress={() => addItemToCart(product)}
        style={styles.button}
        disabled={addedToCart}
      >
        <Text style={styles.buttonText}>
          {addedToCart ? 'Added to Cart' : 'Add to Cart'}
        </Text>
      </Pressable>
    </Pressable>
  );
};



export default ProductItem;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 0,
    marginVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f2f1ef',
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 5,
    borderRadius: 10, width: 180, paddingVertical: 10, height: 300
  },

  image: {
    width: 150,
    height: 120,
    // resizeMode: 'contain',
  },
  title: {
    width: 150,
    marginTop: 10, textAlign: 'center', fontWeight: 'bold'
  },
  description: {
    width: 150,
    marginTop: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    justifyContent: 'space-evenly', width: '100%'
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold', color: '#00b894'
  },
  rupee: {
    color: '#b2bec3',
    fontWeight: 'bold', marginRight: -4,
    textDecorationLine: 'line-through'
  },
  rating: {
    color: '#b2bec3',
    fontWeight: 'bold',
    textDecorationLine: 'line-through'
  },
  button: {
    backgroundColor: '#FFC72C',
    paddingHorizontal: 15, paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
    marginTop: 10, position: 'absolute', bottom: 15,
  },
  buttonText: {
    fontWeight: 'bold',
  },
});
