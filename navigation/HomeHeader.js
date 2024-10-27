import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { BottomModal, ModalContent, SlideAnimation } from 'react-native-modals';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { UserType } from '../UserContext';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

const HomeHeader = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigation = useNavigation();
    const [address, setAddress] = useState('');
    const [pincode, setPincode] = useState({});
    const [addresses, setAddresses] = useState([]);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
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
            const street = result.street || '';
            const city = result.city || '';
            const region = result.region || '';
            const country = result.country || '';
            const postalCode = result.postalCode || '';
            const formattedAddress = `${street ? street + ', ' : ''}${city}${city && region ? ', ' : ''}${region}${region && country ? ', ' : ''}${country}${postalCode ? ' - ' + postalCode : ''}`;

            setAddress(formattedAddress);
            setPincode({ postalCode, city });
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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => setModalVisible(!modalVisible)} style={styles.addressButton}>
                    <Ionicons name="location" size={28} color="#005aa8" />
                    <View>
                        <Text style={styles.postalCodeText}>{pincode?.postalCode}</Text>
                        <Text style={styles.cityText}>{pincode.city}</Text>
                    </View>
                    {selectedAddress ? (
                        <Text style={styles.selectedAddressText}>
                            Deliver to {selectedAddress?.name} - {selectedAddress?.street}
                        </Text>
                    ) : (
                        <Text style={styles.placeholderText} />
                    )}
                </Pressable>

                {drawerOpen ? (
                    <Entypo name="cross" size={35} color="#005aa8" onPress={toggleDrawer} />
                ) : (
                    <FontAwesome
                        name="bars"
                        size={29}
                        color="#005aa8"
                        onPress={toggleDrawer}
                        style={styles.barsIcon}
                    />
                )}
            </View>
            <BottomModal
                onBackdropPress={() => setModalVisible(!modalVisible)}
                swipeDirection={['up', 'down']}
                swipeThreshold={200}
                modalAnimation={new SlideAnimation({ slideFrom: 'bottom' })}
                onHardwareBackPress={() => setModalVisible(!modalVisible)}
                visible={modalVisible}
                onTouchOutside={() => setModalVisible(!modalVisible)}
            >
                <ModalContent style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Choose your Location</Text>
                        <Text style={styles.modalSubtitle}>
                            Select a delivery location to see product availability and delivery options
                        </Text>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {addresses?.map((item, index) => (
                            <Pressable
                                onPress={() => setSelectedAddress(item)}
                                key={index}
                                style={[styles.addressCard, selectedAddress === item && styles.selectedCard]}
                            >
                                <View style={styles.addressRow}>
                                    <Text style={styles.addressName}>{item?.name}</Text>
                                    <Entypo name="location-pin" size={24} color="red" />
                                </View>
                                <Text style={styles.addressDetail} numberOfLines={1}>
                                    {item?.houseNo}, {item?.landmark}
                                </Text>
                                <Text style={styles.addressDetail} numberOfLines={1}>
                                    {item?.street}
                                </Text>
                                <Text style={styles.addressDetail} numberOfLines={1}>
                                    India, Rajasthan
                                </Text>
                            </Pressable>
                        ))}
                        <Pressable
                            onPress={() => {
                                setModalVisible(false);
                                navigation.navigate('Address');
                            }}
                            style={styles.addAddressCard}
                        >
                            <Text style={styles.addAddressText}>
                                Add an Address or pick-up point
                            </Text>
                        </Pressable>
                    </ScrollView>
                    <View style={styles.pincodeSection}>
                        <View style={styles.pincodeRow}>
                            <Entypo name="location-pin" size={22} color="#0066B2" />
                            <Text style={styles.pincodeText}>Enter an Indian Pincode</Text>
                        </View>
                        <View style={styles.pincodeRow}>
                            <Ionicons name="locate-sharp" size={22} color="#0066B2" />
                            <Text style={styles.pincodeText} onPress={getLocation}>
                                Use My Current Location
                            </Text>
                        </View>
                        <View style={styles.pincodeRow}>
                            <AntDesign name="earth" size={22} color="#0066B2" />
                            <Text style={styles.pincodeText}>Deliver outside India</Text>
                        </View>
                    </View>
                </ModalContent>
            </BottomModal>
            <BottomModal
                onBackdropPress={() => setDrawerOpen(!drawerOpen)}
                swipeDirection={['up', 'down']}
                swipeThreshold={200}
                modalAnimation={new SlideAnimation({ slideFrom: 'right' })}
                onHardwareBackPress={() => setDrawerOpen(!drawerOpen)}
                visible={drawerOpen}
                onTouchOutside={() => setDrawerOpen(!drawerOpen)}
            >
                <ModalContent style={styles.sidebarContent}>
                    <View>
                        <Text>Hello</Text>
                    </View>
                </ModalContent>
            </BottomModal>
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
    placeholderText: {
        fontSize: 13,
        fontWeight: '500',
    },
    barsIcon: {
        paddingRight: 10,
    },
    modalContent: {
        width: '100%',
        height: 'auto',
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    modalHeader: {
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#005aa8',
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#6b6b6b',
    },
    addressCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 5,
        elevation: 2,
        width: 200,
    },
    selectedCard: {
        borderWidth: 2,
        borderColor: '#005aa8',
    },
    addressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    addressName: {
        fontWeight: 'bold',
        color: '#005aa8',
    },
    addressDetail: {
        fontSize: 12,
        color: 'grey',
    },
    addAddressCard: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginTop: 10,
    },
    addAddressText: {
        fontSize: 14,
        color: '#005aa8',
        fontWeight: 'bold',
    },
    pincodeSection: {
        marginTop: 20,
        padding: 10,
    },
    pincodeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
    },
    pincodeText: {
        marginLeft: 10,
        color: '#0066B2',
        fontSize: 14,
    },
    sidebarContent: {
        width: '70%',
        height: '90%',
        backgroundColor: 'white',
        padding: 20,
    },
});
