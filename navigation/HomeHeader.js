import { StyleSheet, Text, View, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { UserType } from '../UserContext';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import Octicons from '@expo/vector-icons/Octicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
const HomeHeader = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'Profile', value: 'profile' },
        { label: 'Settings', value: 'settings' },
        { label: 'Logout', value: 'logout' },
    ]);
    const navigation = useNavigation();
    const [address, setAddress] = useState('');
    const [pincode, setPincode] = useState({});
    const [addresses, setAddresses] = useState([]);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
        setOpen(!open);
    };

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
            const formattedAddress = `${result.street || ''}, ${result.city || ''}, ${result.region || ''}, ${result.country || ''} - ${result.postalCode || ''}`;
            setAddress(formattedAddress);
            setPincode({ postalCode: result.postalCode, city: result.city });
        } else {
            alert("Error", "Unable to retrieve address.");
        }
    };

    const { userId, setUserId } = useContext(UserType);

    useEffect(() => {
        if (userId) {
            fetchAddresses();
        }
    }, [userId, modalVisible]);

    const fetchAddresses = async () => {
        try {
            const response = await axios.get(`http://192.168.31.155:8000/addresses/${userId}`);
            const { addresses } = response.data;
            setAddresses(addresses);
        } catch (error) {
            console.log('Error', error);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            const token = await AsyncStorage.getItem('authToken');
            const decodedToken = jwt_decode(token);
            const userId = decodedToken.userId;
            setUserId(userId);
        };
        fetchUser();
    }, []);

    const clearAuthToken = async () => {
        await AsyncStorage.removeItem('authToken');
        navigation.replace('Login');
    };

    const handleBarsButton = (num) => {
        if (num == 1) {
            setDrawerOpen(!drawerOpen);
            navigation.navigate('Cart')
        }
        if (num == 2) {
            setDrawerOpen(!drawerOpen);
            navigation.navigate('yourAccount')
            
        }
        if (num == 3) {
            setDrawerOpen(!drawerOpen);
            navigation.navigate('yourOrder')
            
        }
        if (num == 4) {
            setDrawerOpen(!drawerOpen);
            clearAuthToken();
        }
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => setModalVisible(!modalVisible)} style={styles.addressButton}>
                    <Ionicons name="location" size={28} color="#005aa8" />
                    {selectedAddress ? (
                        <Text style={styles.selectedAddressText}>
                            Deliver to {selectedAddress?.name} - {selectedAddress?.street}
                        </Text>
                    ) : (
                        <View>
                            <Text style={styles.postalCodeText}>{pincode?.postalCode}</Text>
                            <Text style={styles.cityText}>{pincode.city}</Text>
                        </View>
                    )}
                </Pressable>

                <FontAwesome
                    name={drawerOpen ? "bars" : "bars"}
                    size={29}
                    color="#005aa8"
                    onPress={toggleDrawer}
                    style={styles.barsIcon}
                />
            </View>

            {drawerOpen && (

                <View style={{ backgroundColor: 'white', height: 900, width: 200, position: 'absolute', right: 0, top: 0 }}>
                    <View style={{ paddingTop: 100, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 10, gap: 20 }}>
                        <TouchableOpacity onPress={() => handleBarsButton(1)} style={{ display: 'flex', flexDirection: 'row', gap: 5, borderWidth: 1, borderColor: 'black', borderRadius: 6, width: 180, padding: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: 'green' }}>
                            <Ionicons name="cart" size={24} color="white" />
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>Cart</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleBarsButton(2)} style={{ display: 'flex', flexDirection: 'row', gap: 5, borderWidth: 1, borderColor: 'black', borderRadius: 6, width: 180, padding: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: 'green' }}>
                            <FontAwesome name="user-circle" size={24} color="white" />
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleBarsButton(3)} style={{ display: 'flex', flexDirection: 'row', gap: 5, borderWidth: 1, borderColor: 'black', borderRadius: 6, width: 180, padding: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: 'green' }}>
                            <Octicons name="history" size={24} color="white" />
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>Orders</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleBarsButton(4)} style={{ display: 'flex', flexDirection: 'row', gap: 5, borderWidth: 1, borderColor: 'black', borderRadius: 6, width: 180, padding: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: 'orange',marginTop:40 }}>
                            <MaterialCommunityIcons name="logout" size={24} color="white" />
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>LogOut</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            )}
        </View>
    );
};

export default HomeHeader;

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    // },
    header: {
        backgroundColor: 'white',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        paddingTop: 35,
    },
    addressButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
    },
    postalCodeText: {
        fontWeight: 'bold',
        color: 'green',
    },
    cityText: {
        fontWeight: '200',
        fontSize: 12,
        color: '#005aa8',
    },
    selectedAddressText: {
        fontSize: 13,
        fontWeight: '500',
    },
    barsIcon: {
        paddingRight: 10,
    },
    dropdownContainer: {
        width: '40%',
        alignSelf: 'flex-end',
        zIndex: 1000, marginTop: -15, marginRight: 4,
    },
});
