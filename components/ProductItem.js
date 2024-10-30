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
    dispatch(addToCart(item)); // Pass full product object here if expected by addToCart

    // Reset the addedToCart state after 1 minute
    setTimeout(() => {
      setAddedToCart(false);
    }, 600000);
  };

  return (
    <Pressable style={styles.container}>
      <Image
        source={{ uri: product?.image }}
        style={styles.image}
      />
      <Text style={styles.title} numberOfLines={1}>
        {product?.title}
      </Text>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>₹{product?.price}</Text>
        <Text style={styles.rating}>
          {/* {product?.rating?.rate} ratings */}
        </Text>
      </View>

      <Pressable
        onPress={() => addItemToCart(product)} // Pass entire product instead of product._id
        style={styles.button}
        disabled={addedToCart} // Disable button when added to cart
      >
        <Text style={styles.buttonText}>
          {addedToCart ? 'Added to Cart' : 'Add to Cart'}
        </Text>
      </Pressable>
    </Pressable>
  );
};

// Optional: Add PropTypes for better type-checking
// ProductItem.propTypes = {
//   product: PropTypes.shape({
//     image: PropTypes.string.isRequired,
//     title: PropTypes.string.isRequired,
//     price: PropTypes.number.isRequired,
//     rating: PropTypes.shape({
//       rate: PropTypes.number,
//     }),
//   }).isRequired,
// };

export default ProductItem;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 25,
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  title: {
    width: 150,
    marginTop: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  rating: {
    color: '#FFC72C',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#FFC72C',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 10,
  },
  buttonText: {
    fontWeight: 'bold',
  },
});
