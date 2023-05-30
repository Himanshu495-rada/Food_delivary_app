import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Button,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import avatar from '../../asset/avatar-2.jpg';
import Icon from 'react-native-vector-icons/FontAwesome';
import messaging from '@react-native-firebase/messaging';
import {StackActions} from '@react-navigation/native';

function Owner({navigation}) {
  const [refreshing, setRefreshing] = useState(false);
  const [hotel, setHotel] = useState([0, '', '', '', '']);
  const [orders, setOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [orderId, setOrderId] = useState(0);

  const handleShowModal = (orderId: number) => {
    setOrderId(orderId);
    setModalVisible(true);
  };

  function truncateText(text: string, limit: number) {
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }

  async function getHotel() {
    await fetch('https://deshmukh.pythonanywhere.com/hotel/1')
      .then(response => response.json())
      .then(data => {
        setHotel(data);
        getOrders();
      });
  }

  async function getOrders() {
    await fetch(
      'https://deshmukh.pythonanywhere.com/orders?username=user@gmail.com&hotel_id=1',
    )
      .then(response => response.json())
      .then(data => {
        setOrders(data);
        setPendingOrders(data.filter((order: any) => order[5] === 'pending'));
        setCompletedOrders(
          data.filter((order: any) => order[5] === 'completed'),
        );
      });
  }

  function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  async function updateToken() {
    getToken();
    const token = await AsyncStorage.getItem('token');
    console.log(token);
    const response = await fetch(
      'https://deshmukh.pythonanywhere.com/update_token',
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
      console.log(response);
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

  async function handleConfirmButtonPress(id: number) {
    const response = await fetch(
      'https://deshmukh.pythonanywhere.com/confirm_order/' + String(id),
    );
    console.log(response);
    if (response.status === 200) {
      setModalVisible(false);
      getOrders();
    }
  }

  async function logout() {
    await AsyncStorage.removeItem('credentials');
    navigation.dispatch(StackActions.replace('Login'));
  }
  useEffect(() => {
    updateToken();
    getOrders();
    getHotel();
  }, []);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={getOrders} />
      }>
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
            <Text style={{marginLeft: 10, color: 'black'}}>
              {truncateText(String(hotel[2]), 15)}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={{color: 'white'}}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.heading}>Recent Orders</Text>
        <ScrollView horizontal={true}>
          {pendingOrders.map((order: any, index: number) => (
            <TouchableOpacity
              style={styles.orderCard}
              key={index}
              onPress={() => handleShowModal(order[0])}>
              <View style={{flexDirection: 'column'}}>
                <Text style={styles.orderCardTitle}>{order[6]}</Text>
                <Text style={{fontSize: 15, color: 'black'}}>
                  {capitalizeFirstLetter(order[3])} Quantity: {order[4]}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View>
        <Text style={styles.heading}>Completed Orders</Text>
        {completedOrders.length === 0 && cancelledOrders.length === 0 && (
          <Text style={{textAlign: 'center', marginTop: 20, color: 'black'}}>
            No orders yet
          </Text>
        )}

        {completedOrders.map((order: any, index: number) => (
          <View style={styles.completedOrderCard} key={index}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{color: 'black'}}>Order ID: - {order[0]}</Text>
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

        {/* {cancelledOrders.map((order: any, index: number) => (
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
        ))} */}
      </View>

      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Icon
              name="close"
              size={20}
              onPress={() => setModalVisible(false)}
              marginLeft={'auto'}
              color="black"
            />
            <Text style={styles.modalText}>
              Do you want to confirm the order ?
            </Text>
            <Text style={styles.modalText}>Order id = {orderId}</Text>
            <Button
              title="Confirm"
              onPress={() => handleConfirmButtonPress(orderId)}
            />
          </View>
        </View>
      </Modal>
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
    fontSize: 15,
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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 10,
    color: 'black',
  },
});

export default Owner;
