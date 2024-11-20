import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useLayoutEffect } from 'react';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';

import {
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from '../redux/CartReducer';
import LottieView from 'lottie-react-native';

import { useNavigation } from '@react-navigation/native';

const CartScreen = () => {
  const navigation = useNavigation(); // Moved up for better context

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: 350, height: 20 }}>
          <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 19 }}>
            Cart Section
          </Text>
        </View>
      ),
      headerStyle: {
        backgroundColor: 'transparent',
      },
      headerRight: () => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            marginRight: 12,
            fontSize: 13,
          }}
        >
          {/* Add any buttons or icons here */}
        </View>
      ),
    });
  }, [navigation]);

  const cart = useSelector((state) => state.cart.cart);
  const total = cart?.map((item) => item.price * item.quantity)
    .reduce((curr, prev) => curr + prev, 0) || 0;

  const dispatch = useDispatch();

  const increaseQuantity = (item) => {
    dispatch(incrementQuantity(item));
  };

  const decreaseQuantity = (item) => {
    dispatch(decrementQuantity(item));
  };

  const deleteItem = (item) => {
    dispatch(removeFromCart(item));
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={{ marginTop: 0, flex: 1, backgroundColor: 'white' }}
    >
      {cart.length > 0 ? <>
        <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: '400' }}>Subtotal: </Text>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>₹{total}</Text>
        </View>

        <Pressable
          onPress={() => navigation.navigate('Confirm')}
          style={{
            backgroundColor: '#FFC72C',
            padding: 10,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 10,
            marginTop: 10,
          }}
        >
          <Text>Proceed to Buy ({cart.length}) item</Text>
        </Pressable></>
        :
        <>
          <Text style={{ textAlign: 'center', position: 'absolute', top: 90, left: 90, fontSize: 20, fontWeight: 'bold', color: 'gray' }}>No items in the Cart 😔</Text>
          <LottieView
            source={require('../assets/emptycart.json')}
            style={{
              height: 280,
              width: 320,
              alignSelf: 'center',
              marginTop: 150,
              justifyContent: 'center',
            }}
            autoPlay
            loop={true}
            speed={0.7}
          />
        </>

      }



      <View style={{ marginHorizontal: 10 }}>
        {cart?.map((item, index) => (
          <View
            key={index}
            style={{
              backgroundColor: 'white',
              marginVertical: 10,
              borderBottomColor: '#F0F0F0',
              borderWidth: 2,
              borderLeftWidth: 0,
              borderRightWidth: 0,
              borderTopWidth: 0,
            }}
          >
            <Pressable
              style={{
                marginVertical: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View >
                <Image
                  style={{ width: 140, height: 140, resizeMode: 'contain' }}
                  source={{ uri: item?.image ? item?.image :item?.imageurl  }}
                />
              </View >
              <View >
                <Text numberOfLines={3} style={{ width: 150, marginTop: 10, fontSize: 15, fontWeight: 'bold', color: '#0a3d62' }}>
                  {item?.title ? item?.title : item?.name}
                </Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', marginTop: 6, color: '#0a3d62' }}>
                  Price : ₹ {item?.price}
                </Text>
                <Pressable
                  style={{
                    marginTop: 15,
                    marginBottom: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 7,
                    }}
                  >
                    {item?.quantity > 1 ? (
                      <Pressable
                        onPress={() => decreaseQuantity(item)}
                        style={{
                          backgroundColor: '#D8D8D8',
                          padding: 7,
                          borderTopLeftRadius: 6,
                          borderBottomLeftRadius: 6,
                        }}
                      >
                        <AntDesign name="minus" size={24} color="black" />
                      </Pressable>
                    ) : (
                      <Pressable
                        onPress={() => deleteItem(item)}
                        style={{
                          backgroundColor: '#D8D8D8',
                          padding: 7,
                          borderTopLeftRadius: 6,
                          borderBottomLeftRadius: 6,
                        }}
                      >
                        <AntDesign name="delete" size={24} color="black" />
                      </Pressable>
                    )}

                    <Pressable>
                      <Text
                        style={{
                          backgroundColor: 'white',
                          paddingHorizontal: 18,
                          paddingVertical: 6,
                        }}
                      >
                        {item?.quantity}
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => increaseQuantity(item)}
                      style={{
                        backgroundColor: '#D8D8D8',
                        padding: 7,
                        borderTopLeftRadius: 6,
                        borderBottomLeftRadius: 6,
                      }}
                    >
                      <Feather name="plus" size={24} color="black" />
                    </Pressable>
                  </View>
                  <Pressable
                    onPress={() => deleteItem(item)}
                    style={{
                      backgroundColor: 'white',
                      paddingHorizontal: 8,
                      paddingVertical: 10,
                      borderRadius: 5,
                      borderColor: '#0a3d62',
                      borderWidth: 0.6,
                    }}
                  >
                    <Text style={{ color: '#0a3d62' }}>Delete</Text>
                  </Pressable>
                </Pressable>
              </View>
            </Pressable>


            {/* <Text style={{ color: 'green', textAlign: 'justify',marginHorizontal:10,marginBottom:4 }} numberOfLines={4}>{item?.description}</Text> */}

          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({});
