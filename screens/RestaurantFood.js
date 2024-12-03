import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    addToCart
} from '../redux/CartReducer';

const RestaurantFood = ({ route, navigation }) => {
    const { restaurantId } = route.params; // Destructure params
    const { name, address, image, rating, items } = restaurantId; // Extract items as well
    const dispatch = useDispatch();

    const addItemToCart = (item) => {
        dispatch(addToCart(item));
    };

    const handleOrder = (item) => {
        addItemToCart(item)
        navigation.navigate('Cart')
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{name}</Text>
            <Image source={{ uri: image }} style={styles.image} />
            <Text style={styles.address}>{address}</Text>
            <Text style={styles.rating}>Rating: {rating} ⭐</Text>

            <View style={styles.itemsContainer}>
                {items && items.length > 0 ? (
                    items.map((item) => (
                        <TouchableOpacity onPress={() => navigation.navigate('fooddetails', { item })}
                            key={item._id} style={styles.itemCard}>
                            <Image source={{ uri: item.imageurl }} style={styles.itemImage} />
                            <View style={styles.itemDetails}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemPrice}>Rs {item.price}</Text>
                                <Text numberOfLines={1} style={styles.itemDescription}>{item.description}</Text>
                            </View>
                            <View style={styles.itemActions}>

                                <TouchableOpacity
                                    onPress={() => handleOrder(item)}
                                    style={styles.editButton}
                                >
                                    <Text style={styles.buttonText}>Order</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.noItemsText}>No items available.</Text>
                )}
            </View>
        </View>
    );
};

export default RestaurantFood;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        marginTop:0,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    address: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
    },
    rating: {
        fontSize: 16,
        color: '#007BFF',
        fontWeight: 'bold',
    },
    itemsContainer: {
        marginTop: 20,
        width: '100%',
    },
    itemCard: {
        flexDirection: 'row',
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    itemImage: {
        width: 70,
        height: 70,
        borderRadius: 10,
        marginRight: 10, resizeMode: 'cover'
    },
    itemDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    itemPrice: {
        fontSize: 16,
        color: '#555',
    },
    itemDescription: {
        fontSize: 14,
        color: '#777',
        marginTop: 5,
    },
    itemActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: '#f44336',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 5,
        marginRight: 10,
    },
    editButton: {
        backgroundColor: '#2ed573',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    noItemsText: {
        textAlign: 'center',
        color: '#777',
        fontSize: 16,
        marginTop: 20,
    },
});
