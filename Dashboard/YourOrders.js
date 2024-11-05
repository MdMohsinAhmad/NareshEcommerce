import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Alert, Animated, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { UserType } from '../UserContext';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const { userId } = useContext(UserType);
    const [scaleValue] = useState(new Animated.Value(1));
    const [filter, setFilter] = useState('All'); // New state for filtering orders

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`http://192.168.31.155:8800/orders/${userId}`);
                setOrders(response.data.orders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        if (userId) {
            fetchOrders();
        }
    }, [userId]);

    const handleCancelProduct = async (orderId, productId) => {
        Alert.alert(
            "Confirm Cancellation",
            "Are you sure you want to cancel this item?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "OK",
                    onPress: async () => {
                        try {
                            const response = await axios.patch(`http://192.168.31.155:8800/orders/${orderId}/cancel/${productId}`);
                            Alert.alert('Success', response.data.message);
                            const updatedOrders = await axios.get(`http://192.168.31.155:8800/orders/${userId}`);
                            setOrders(updatedOrders.data.orders);
                        } catch (error) {
                            console.error('Error canceling product:', error);
                            Alert.alert('Error', 'Unable to cancel the product. Please try again later.');
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    };

    const filteredOrders = orders
        .sort((a, b) => a.orderStatus - b.orderStatus) // Sort by status: pending (false) on top
        .filter(order =>
            filter === 'All' ||
            (filter === 'Pending' && !order.orderStatus) ||
            (filter === 'Delivered' && order.orderStatus)
        );
    const renderOrderItem = ({ item }) => (
        <>
            {item.totalPrice !== 0 && (
                <View style={styles.orderCard}>
                    <Text style={styles.orderStatus}>Order Status: {item.orderStatus ? "Delivered" : "Pending"}</Text>
                    <Text style={styles.orderDate}>Ordered on: {new Date(item.createdAt).toLocaleDateString()}</Text>
                    <Text style={styles.total}>Total Price : ₹ {item.totalPrice}</Text>

                    {item.products.map((product, index) => (
                        <View key={index} style={styles.productContainer}>
                            <Image source={{ uri: product.image }} resizeMode="contain" style={styles.image} />
                            <View style={styles.infoContainer}>
                                <Text style={styles.itemName}>{product.name}</Text>
                                <Text style={styles.itemDetails}>Qty: {product.quantity}</Text>
                                <Text style={styles.itemDetails}>Price: ₹ {product.price}</Text>
                                <Text style={styles.itemDetails}>Total: ₹ {product.price * product.quantity}</Text>
                                <Text style={styles.itemDetails}>Order ID : {product.uniqueId}</Text>
                                <Text style={styles.itemStatus}>Status : {!product.orderStatus ? 'Pending' : 'Delivered'}</Text>
                                {!product.orderStatus && (
                                    <TouchableOpacity onPress={() => handleCancelProduct(item._id, product._id)}>
                                        <Animated.View style={[styles.cancelButton, { transform: [{ scale: scaleValue }] }]}>
                                            <Text style={styles.cancelButtonText}>Cancel order</Text>
                                        </Animated.View>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </>
    );

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.filterButton, filter === 'All' && styles.activeButton]}
                    onPress={() => setFilter('All')}
                >
                    <Text style={styles.buttonText}>All Orders</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, filter === 'Pending' && styles.activeButton]}
                    onPress={() => setFilter('Pending')}
                >
                    <Text style={styles.buttonText}>Pending</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, filter === 'Delivered' && styles.activeButton]}
                    onPress={() => setFilter('Delivered')}
                >
                    <Text style={styles.buttonText}>Delivered</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredOrders}
                keyExtractor={(item) => item._id}
                renderItem={renderOrderItem}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={<Text style={styles.emptyText}>No orders found.</Text>}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f8',
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    filterButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#d3d3d3',
        borderRadius: 20,
    },
    activeButton: {
        backgroundColor: '#007AFF',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    listContainer: {
        paddingBottom: 20,
    },
    orderCard: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    orderStatus: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4a4a4a',
        marginBottom: 5,
    },
    orderDate: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 15,
        fontWeight: 'bold',
    },
    total: {
        fontSize: 17,
        color: 'gray',
        marginBottom: 15,
        fontWeight: 'bold',
    },
    productContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    image: {
        width: 100,
        height: 170,
        borderRadius: 10,
        marginRight: 15,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    infoContainer: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    itemDetails: {
        fontSize: 14,
        color: '#666',
        marginVertical: 2,
    },
    itemStatus: {
        fontSize: 16,
        color: 'black',
        marginVertical: 2,
        fontWeight: 'bold',
    },
    cancelButton: {
        marginTop: 10,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: '#e74c3c',
        borderRadius: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    cancelButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default OrderHistory;
