import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Alert, Animated, TouchableOpacity, ActivityIndicator, RefreshControl, Pressable } from 'react-native';
import axios from 'axios';
import { UserType } from '../UserContext';
import URL_path from '../URL';

const OrderHistory = ({ navigation }) => {
    const [orders, setOrders] = useState([]);
    const { userId } = useContext(UserType);
    const [scaleValue] = useState(new Animated.Value(1));
    const [currentStatus, setCurrentStatus] = useState('pending'); // Multiple statuses as an array
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${URL_path}/orders/${userId}`);
            setOrders(response.data.orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterOrders = (status) => {
        if (currentStatus.includes(status)) {
            // Remove status from array if it's already included
            setCurrentStatus(currentStatus.filter(item => item !== status));
        } else {
            // Add status to array
            setCurrentStatus(status);
        }
    };

    const filteredOrders = currentStatus === 'All'
        ? orders
        : orders.filter(order =>
            order.products.some(product => currentStatus.includes(product.orderStatus.toLowerCase()))
        );

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
                            const response = await axios.put(`${URL_path}/orders/${orderId}/cancel/${productId}`);
                            Alert.alert('Success', response.data.message);
                            fetchOrders();
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

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchOrders();
        setRefreshing(false);
    };

    useEffect(() => {
        if (userId) {
            fetchOrders();
        }
    }, [userId]);

    const renderOrderItem = ({ item }) => {
        const totalPayable = item.products
            .filter(product => product.orderStatus !== 'canceled')
            .reduce((sum, product) => sum + product.price * product.quantity, 0);

        return (
            <View style={styles.orderCard}>
                <Text style={styles.orderStatus}>Order History</Text>
                <Text style={styles.orderDate}>Ordered on: {new Date(item.createdAt).toLocaleDateString()}</Text>
                <Text style={item.paymentMethod === 'cash' ? styles.cashPayment : styles.onlinePayment}>
                    Payment Mode: {item.paymentMethod === 'cash' ? 'Cash on delivery' : "Paid Online"}
                </Text>
                {item?.paymentId && <Text style={styles.total}>Payment ID: {item?.paymentId}</Text>}
                <Text style={styles.total}>Total Payable: ₹ {totalPayable === 0 ? 0 : totalPayable + 40}<Text style={{ fontSize: 12, color: 'black' }}> (included delivery charges)</Text></Text>

                {item.products.map((product, index) => (
                    <Pressable onPress={() => navigation.navigate('OrderItemHistory', {product})} key={index} style={styles.productContainer}>
                        <Image source={{ uri: product.image }} resizeMode="contain" style={styles.image} />
                        <View style={styles.infoContainer}>
                            <Text style={styles.itemName}>{product.name}</Text>
                            <Text style={styles.itemDetails}>Qty: {product.quantity}</Text>
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.itemDetails}>Price: ₹ {product.price}</Text>
                                <Text style={styles.total}>Total: ₹ {product.price * product.quantity}</Text>
                            </View>
                            <Text style={styles.itemDetails}>Order ID: {product.uniqueId}</Text>
                            <Text style={styles.getStatusStyle(product.orderStatus)}>
                                Status: {product.orderStatus}
                            </Text>
                            {item.paymentMethod === 'card' && (
                                <Text style={{ marginTop: 4, color: 'orange', fontWeight: 'bold' }}>
                                    * Online payment order cannot be cancelled
                                </Text>
                            )}
                            {product.orderStatus === 'pending' && item.paymentMethod === 'cash' && (
                                <TouchableOpacity onPress={() => handleCancelProduct(item._id, product._id)}>
                                    <Animated.View style={[styles.cancelButton, { transform: [{ scale: scaleValue }] }]}>
                                        <Text style={styles.cancelButtonText}>Cancel order</Text>
                                    </Animated.View>
                                </TouchableOpacity>
                            )}
                        </View>
                    </Pressable>
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                {['pending', 'packed', 'delivered', 'All'].map(status => (
                    <TouchableOpacity
                        key={status}
                        style={[styles.filterButton, currentStatus.includes(status) && styles.activeButton]}
                        onPress={() => filterOrders(status)}
                    >
                        <Text style={styles.buttonText}>{status.charAt(0).toUpperCase() + status.slice(1)}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#13274F" style={styles.loadingIndicator} />
            ) : (
                <FlatList
                    data={filteredOrders}
                    keyExtractor={(item) => item._id}
                    renderItem={renderOrderItem}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={<Text style={styles.emptyText}>No orders found.</Text>}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f4f8', paddingHorizontal: 16, paddingTop: 10 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
    filterButton: { paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#d3d3d3', borderRadius: 20 },
    activeButton: { backgroundColor: '#007AFF' },
    loadingIndicator: { marginTop: 40, height: 200 },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    listContainer: { paddingBottom: 20 },
    orderCard: { backgroundColor: '#ffffff', padding: 20, borderRadius: 15, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, elevation: 5, marginVertical: 10, borderWidth: 1, borderColor: '#e0e0e0' },
    orderStatus: { fontSize: 18, fontWeight: 'bold', color: '#4a4a4a', marginBottom: 5 },
    orderDate: { fontSize: 14, color: 'gray', marginBottom: 15, fontWeight: 'bold' },
    total: { fontSize: 16, color: '#3498db', fontWeight: 'bold' },
    cashPayment: { fontSize: 18, color: '#e67e22', marginBottom: 15, fontWeight: 'bold' },
    onlinePayment: { fontSize: 18, color: '#27ae60', marginBottom: 15, fontWeight: 'bold' },
    productContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 5, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    image: { width: 100, height: 170, borderRadius: 10, marginRight: 15, borderWidth: 1, borderColor: '#e0e0e0' },
    infoContainer: { flex: 1 },
    itemName: { fontSize: 16, fontWeight: '600', color: '#333' },
    itemDetails: { fontSize: 14, color: 'gray', fontWeight: 'bold' },
    cancelButton: { backgroundColor: '#e74c3c', padding: 10, borderRadius: 5, alignItems: 'center' },
    cancelButtonText: { color: '#fff', fontWeight: 'bold' },
    emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: 'gray' },
    getStatusStyle: (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return { color: '#f39c12', fontWeight: 'bold', fontSize: 20, marginBottom: 10 };
            case 'packed': return { color: '#f1c40f', fontWeight: 'bold', fontSize: 20, marginBottom: 10 };
            case 'delivered': return { color: '#2ecc71', fontWeight: 'bold', fontSize: 20, marginBottom: 10 };
            case 'canceled': return { color: '#e74c3c', fontWeight: 'bold', fontSize: 20, marginBottom: 10 };
            default: return { color: '#3498db', fontWeight: 'bold' };
        }
    }
});

export default OrderHistory;
