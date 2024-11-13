import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import URL_path from '../URL';
import { useDispatch, useSelector } from 'react-redux';
import { FlatList, TouchableOpacity, Image, ScrollView, Pressable, ActivityIndicator, Platform } from 'react-native';
import { addToCart, decrementQuantity, incrementQuantity, removeFromCart } from '../redux/CartReducer';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const SelectedItems = ({ route }) => {
    const selecteditem = route.params;
    const [products, setProducts] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addedToCart, setAddedToCart] = useState(false);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const cart = useSelector((state) => state.cart.cart);
    const quantity = cart.find((item) => item._id === item._id)?.quantity || 0;

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${URL_path}/api/products`);
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.log('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterItems = () => {
        setLoading(true);
        const filter = products.filter((product) => product.category === selecteditem);
        if (filter.length > 0) {
            setFilteredItems(filter)
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterItems()
    }, [products]);

    useEffect(() => {
        if (quantity === 0) {
            setAddedToCart(false);
        }
    }, [quantity]);

    const addItemToCart = (product) => {
        setAddedToCart(true);
        dispatch(addToCart(product));
    };

    const increaseQuantity = (item) => dispatch(incrementQuantity(item));
    const decreaseQuantity = (item) => quantity > 1 ? dispatch(decrementQuantity(item)) : removeItemFromCart(item);
    const removeItemFromCart = (item) => {
        dispatch(removeFromCart(item));
        setAddedToCart(false);
    };

    const renderItem = ({ item }) => {
        const itemQuantity = cart.find((cartItem) => cartItem._id === item._id)?.quantity || 0;

        return (
            <Pressable style={itemQuantity > 0 ? styles.containerAdded : styles.itemContainer} key={item._id}>
                <TouchableOpacity onPress={() => navigation.navigate('Info', { product: item })}>
                    <Image source={{ uri: item?.image }} style={styles.image} resizeMode="contain" />
                    <Text style={styles.title} numberOfLines={1}>{item?.title}</Text>
                    <Text style={styles.description} numberOfLines={2}>{item?.description}</Text>
                    <Text style={styles.description}>Quantity: {itemQuantity}</Text>
                    <View style={styles.priceContainer}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.rupee}>₹ </Text>
                            <Text style={styles.rating}>
                                {item?.MRP === null ? item.price + 12 : item.MRP}
                            </Text>
                        </View>
                        <Text style={styles.price}>₹{item?.price}</Text>
                    </View>
                </TouchableOpacity>

                {itemQuantity < 1 && (
                    <Pressable onPress={() => addItemToCart(item)} style={styles.button}>
                        <Text style={styles.buttonText}>Add to Cart</Text>
                    </Pressable>
                )}

                {itemQuantity > 0 && (
                    <Pressable style={styles.quantityContainer}>
                        <Pressable onPress={() => decreaseQuantity(item)} style={styles.iconContainer}>
                            {itemQuantity > 1 ? (
                                <AntDesign name="minus" size={20} color="black" />
                            ) : (
                                <AntDesign name="delete" size={20} color="red" />
                            )}
                        </Pressable>

                        <Text style={styles.quantityText}>{itemQuantity}</Text>

                        <Pressable onPress={() => increaseQuantity(item)} style={styles.iconContainerAdd}>
                            <Feather name="plus" size={20} color="white" />
                        </Pressable>
                    </Pressable>
                )}
            </Pressable>
        );
    };

    return (
        <View style={styles.container}>

            {loading ?
                <ActivityIndicator size="large" color="#13274F" style={styles.loadingIndicator} />
                :
                <FlatList
                    data={filteredItems}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContainer}
                    numColumns={2}
                />
            }

            {!loading && filteredItems.length == 0 && <Text style={{ textAlign: 'center',  position: 'absolute', top: '50%', left: '6%', fontSize: 22 }}>No Items Found. It will be listed soon.</Text>
            }
        </View>
    );
};

export default SelectedItems;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 4, paddingTop: Platform.OS === 'android' ? 40 : 0,
    },
    listContainer: {
        paddingBottom: 13,
    },
    itemContainer: {
        flex: 1,
        margin: 8,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        width: 180,
        paddingVertical: 10,
        height: 330,
        borderColor: 'white',
        borderWidth: 2, shadowColor: '#00acc1',
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 15,
        elevation: 10,
    },
    image: {
        width: 150,
        height: 120,
        borderRadius: 10,
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
        width: 172,
        paddingVertical: 10,
        height: 330,
        borderColor: '#00bcd4',
        borderWidth: 2, justifyContent: 'space-between', marginHorizontal: 8
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
        color: '#555',
        textAlign: 'center',
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
        textDecorationLine: 'line-through',
        fontSize: 15,
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
        color: '#333',
        marginHorizontal: 5,
    },
    loadingIndicator: {
        position: 'absolute', top: '50%', left: '46%'
    }
});
