import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import avatar from '../../asset/avatar-2.jpg';
import Icon from 'react-native-vector-icons/FontAwesome';
import messaging from '@react-native-firebase/messaging';

function Owner() {
  const [hotel, setHotel] = useState([0, '', '', '', '']);
  const [orders, setOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  function truncateText(text: string, limit: number) {
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }

  async function getHotel() {
    const response = await fetch('http://deshmukh.pythonanywhere.com/hotel/1')
      .then(response => response.json())
      .then(data => {
        setHotel(data);
      });
  }

  async function getOrders() {
    const response = await fetch(
      'http://deshmukh.pythonanywhere.com/orders?username=user@gmail.com&hotel_id=1',
    )
      .then(response => response.json())
      .then(data => {
        setOrders(data);
        console.log(data);
      });

    setPendingOrders(orders.filter((order: any) => order[5] === 'pending'));
    setCompletedOrders(orders.filter((order: any) => order[5] === 'completed'));
    // filter orders with same createdAt
    
  }

  function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  async function updateToken() {
    getToken();
    const token = await AsyncStorage.getItem('token');
    console.log(token);
    const response = await fetch(
      'http://deshmukh.pythonanywhere.com/update_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'owner1@gmail.com',
          device_token: token,
        }),
      },
    );
    if (response.status === 200) {
      console.log('Token updated');
    } else {
      console.log('Token not updated');
      console.log(response);
    }
  }

  async function getToken() {
    console.log('Checking token');
    let token = await AsyncStorage.getItem('token');
    if (token) {
      return token;
    } else {
      try {
        let token = await messaging().getToken();
        console.log(token);
        AsyncStorage.setItem('token', token);
        return token;
      } catch (error) {
        console.log(error);
        return 0;
      }
    }
  }

  useEffect(() => {
    getHotel();
    getOrders();
    updateToken();
  }, []);

  return (
    <ScrollView>
      <View style={styles.profileCard}>
        <Image
          source={avatar}
          style={{width: 50, height: 50, borderRadius: 1}}
        />
        <View style={{flexDirection: 'column', marginLeft: 10}}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: 'black',
            }}>
            {hotel[1]}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="map-pin" size={20} color="red" style={{marginTop: 5}} />
            <Text style={{marginLeft: 10}}>{truncateText(hotel[2], 15)}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={{color: 'white'}}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.heading}>Recent Orders</Text>
        <ScrollView horizontal={true}>
          {pendingOrders.map((order: any, index: number) => (
            <View style={styles.orderCard} key={index}>
              <View style={{flexDirection: 'column'}}>
                <Text style={styles.orderCardTitle}>{order[6]}</Text>
                <Text style={{fontSize: 15, color: 'black'}}>
                  {capitalizeFirstLetter(order[3])} Quantity: {order[4]}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
      <View>
        <Text style={styles.heading}>Completed Orders</Text>
        {completedOrders.length === 0 && cancelledOrders.length === 0 && (
          <Text style={{textAlign: 'center', marginTop: 20}}>
            No orders yet
          </Text>
        )}

        {completedOrders.map((order: any, index: number) => (
          <View style={styles.completedOrderCard} key={index}>
            <View style={{flexDirection: 'row'}}>
              <Text>Order ID: - 1</Text>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: 'black',
                  }}>
                  Completed
                </Text>
              </View>
            </View>
          </View>
        ))}

        {cancelledOrders.map((order: any, index: number) => (
          <View style={styles.cancelOrderCard}>
            <View style={{flexDirection: 'row'}}>
              <Text>Order ID: - 2</Text>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: 'black',
                  }}>
                  Cancelled
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderCard: {
    backgroundColor: '#f58484',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  completedOrderCard: {
    backgroundColor: '#8df7bd',
    width: '90%',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelOrderCard: {
    backgroundColor: '#f2f78d',
    width: '90%',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 20,
    color: 'black',
  },
  logoutBtn: {
    marginLeft: 'auto',
    backgroundColor: 'red',
    height: 40,
    width: 70,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
});

export default Owner;
