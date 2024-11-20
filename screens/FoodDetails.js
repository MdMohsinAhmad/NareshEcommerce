import { StyleSheet, Text, View, Image, TouchableOpacity, Pressable } from 'react-native';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, decrementQuantity, incrementQuantity, removeFromCart } from '../redux/CartReducer';
import { AntDesign, Feather } from '@expo/vector-icons';

const FoodDetails = ({ route, navigation }) => {
    const { item } = route.params; // Destructure params
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.cart);
    const cartItem = cart.find((cartItem) => cartItem._id === item._id); // Correctly identify the cart item
    const quantity = cartItem ? cartItem.quantity : 0;

    const addItemToCart = (item) => {
        dispatch(addToCart(item));
    };

    const increaseQuantity = () => {
        dispatch(incrementQuantity(item));
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            dispatch(decrementQuantity(item));
        } else {
            dispatch(removeFromCart(item));
        }
    };

    const handleBuyItem = (item) => {
        if (quantity > 0) {
            navigation.navigate('Cart');
            return
        }
        addItemToCart(item);
        navigation.navigate('Cart');
    };

    return (
        <View style={styles.container}>
            <Image source={{ uri: item.imageurl }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>Rs {item.price}</Text>
            <Text style={styles.description}>{item.description}</Text>

            {/* Add to Cart Button */}
            {quantity === 0 ? (
                <TouchableOpacity style={styles.button} onPress={() => addItemToCart(item)}>
                    <Text style={styles.buttonText}>Add to Cart</Text>
                </TouchableOpacity>
            ) : (
                <View style={styles.quantityContainer}>
                    <Pressable onPress={decreaseQuantity} style={styles.iconContainer}>
                        {quantity > 1 ? (
                            <AntDesign name="minus" size={20} color="black" />
                        ) : (
                            <AntDesign name="delete" size={20} color="red" />
                        )}
                    </Pressable>
                    <Text style={styles.quantityText}>{quantity}</Text>
                    <Pressable onPress={increaseQuantity} style={styles.iconContainerAdd}>
                        <Feather name="plus" size={20} color="white" />
                    </Pressable>
                </View>
            )}

            {/* Buy Now Button */}
            <TouchableOpacity style={[styles.button, styles.buyNowButton]} onPress={() => handleBuyItem(item)}>
                <Text style={styles.buttonText}>Buy Now</Text>
            </TouchableOpacity>
        </View>
    );
};

export default FoodDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        marginTop: 0,
    },
    quantityContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        paddingHorizontal: 15,
        paddingVertical: 5,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        justifyContent: 'center',width:150
    },
    iconContainer: {
        backgroundColor: '#fab1a0',
        padding: 7,
        borderRadius: 5,marginRight:8
    },
    iconContainerAdd: {
        backgroundColor: '#00b894',
        padding: 7,
        borderRadius: 5,marginLeft:8
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 10,
        marginBottom: 20,
        resizeMode: 'cover',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    price: {
        fontSize: 20,
        color: '#FF6347',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginTop: 20,
    },
    button: {
        width: '80%',
        padding: 15,
        marginVertical: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        alignItems: 'center',
    },
    buyNowButton: {
        backgroundColor: '#FF6347',
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    quantityText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 10,
    },
});

