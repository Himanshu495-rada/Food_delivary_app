import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ToastAndroid,
} from 'react-native';
import {StackActions} from '@react-navigation/native';

function Cart({route, navigation}) {
  const [orders, setOrders] = useState(route.params);
  const [total, setTotal] = useState(0);

  function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  async function sendOrderToServer(order: any): Promise<void> {
    try {
      console.log('Sending order:', order);
      const response = await fetch(
        'https://deshmukh.pythonanywhere.com/addOrders',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(order),
        },
      );

      if (response.ok) {
        // Order sent successfully
        console.log('Order sent successfully');
      } else {
        // Error sending order
        console.log('Error sending order');
      }
    } catch (error) {
      console.error('Error sending order:', error);
    }
  }

  async function addOrders() {
    for (const order of orders) {
      const o = {
        hotel_id: order[1],
        user_name: 'user@gmail.com',
        food_name: order[2],
        quantity: 1,
        status: 'pending',
      };
      await sendOrderToServer(o);
    }
    ToastAndroid.show('Order Placed Successfully', ToastAndroid.SHORT);
    navigation.dispatch(StackActions.replace('User'));
  }

  function removeFromCart(item: any) {
    const index = orders.indexOf(item);
    if (index > -1) {
      orders.splice(index, 1);
    }
    setOrders([...orders]);
  }

  useEffect(() => {
    let num = 0;
    for (const i of orders) {
      num += Number(i[3]);
    }
    setTotal(num);
  }, []);

  return (
    <ScrollView>
      <Text style={styles.heading}>Cart</Text>
      <View style={styles.cartContainer}>
        {orders.map((order, index) => (
          <View key={index} style={styles.order}>
            <View style={{alignItems: 'center'}}>
              <Image
                source={{
                  uri:
                    'https://deshmukh.pythonanywhere.com/food-images/' +
                    order[4],
                }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 10,
                }}
              />
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeFromCart(order)}>
                <Text style={styles.removeBtnText}>Remove</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.orderText}>
              {capitalizeFirstLetter(order[2])}
            </Text>
            <View>
              <Text style={{marginLeft: 15, color: 'black'}}>
                Price: {order[3]} ₹
              </Text>
              <Text style={{marginLeft: 15, color: 'black'}}>Quantity: 1</Text>
            </View>
          </View>
        ))}
        <Text style={styles.totalText}>Total: {total} ₹</Text>
      </View>
      <TouchableOpacity style={styles.buyBtn} onPress={addOrders}>
        <Text style={styles.buyBtnText}>Place Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: {fontSize: 30, color: 'black', textAlign: 'center'},
  cartContainer: {
    borderWidth: 1,
    borderColor: 'black',
    width: '95%',
    alignSelf: 'center',
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'white',
  },
  order: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 2,
    padding: 2,
  },
  orderText: {
    fontSize: 15,
    color: 'black',
    marginLeft: 20,
  },
  buyBtn: {
    backgroundColor: 'green',
    width: '90%',
    height: 50,
    alignSelf: 'center',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buyBtnText: {
    color: 'white',
    fontSize: 20,
  },
  totalText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  removeBtn: {
    width: 80,
    height: 25,
    backgroundColor: 'white',
    elevation: 5,
    borderRadius: 5,
    marginTop: -10,
  },
  removeBtnText: {
    textAlign: 'center',
    color: 'red',
  },
});

export default Cart;
