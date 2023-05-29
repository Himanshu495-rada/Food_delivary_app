import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import avatar from '../../asset/customer_avatar.png';
import Icon from 'react-native-vector-icons/FontAwesome';
import {StackActions} from '@react-navigation/native';

function User({navigation}) {
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [restaurants, setRestaurants] = useState([]);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
    unit: 'km' | 'mi' = 'km',
  ): number => {
    const toRadians = (value: number) => (value * Math.PI) / 180;

    const R = unit === 'km' ? 6371 : 3956; // Radius of the Earth in km or mi
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return Number(distance.toFixed(2));
  };

  // const restaurants = [
  //   {
  //     name: 'MAAHI DHABA',
  //     address:
  //       'Hinjewadi Phase 1 Rd, near Radisson blue hotel, Phase 1, Hinjawadi Rajiv Gandhi Infotech Park, Hinjawadi, Pune, Maharashtra 411057',
  //     image: require('../../asset/restaurants/1.jpg'),
  //     rating: 4.2,
  //     reviews: 100,
  //     menu: [{
  //       name: 'tea',
  //       price: 10,
  //       image: require('../../asset/restaurants/1.jpg'),
  //     }],
  //     distance: calculateDistance(lat, long, 18.5825925, 73.7393294, 'km'),
  //   },
  //   {
  //     name: 'PKs bar and restaurant',
  //     address:
  //       'opp. PDC bank, Phase 1, Hinjawadi Rajiv Gandhi Infotech Park, Hinjawadi, Pune, Maharashtra 411057',
  //     image: require('../../asset/restaurants/2.jpg'),
  //     rating: 4,
  //     reviews: 10,
  //     menu: [''],
  //     distance: calculateDistance(lat, long, 18.5844629, 73.7296671, 'km'),
  //   },
  //   {
  //     name: 'Citrus Cafe',
  //     address:
  //       'HPPM+7Q6, LEMON TREE HOTEL, Hinjewadi Phase 1 Rd, Phase 1, Hinjawadi Rajiv Gandhi Infotech Park, Hinjawadi, Pimpri-Chinchwad, Maharashtra 411057',
  //     image: require('../../asset/restaurants/3.jpg'),
  //     rating: 5,
  //     reviews: 112,
  //     menu: [''],
  //     distance: calculateDistance(lat, long, 18.58645611, 73.73447361, 'km'),
  //   },
  //   {
  //     name: "Thorat's Baarbeque Misal - Hinjewadi",
  //     address:
  //       'Shop No.1 Ground floor, hash tag building near 9 downtown Wineshop, man road, Hinjewadi Phase 1 Rd, Hinjawadi, Pune, Maharashtra 411057',
  //     image: require('../../asset/restaurants/4.jpg'),
  //     rating: 4,
  //     reviews: 10,
  //     menu: [''],
  //     distance: calculateDistance(lat, long, 18.5831604, 73.7261688, 'km'),
  //   },
  //   {
  //     name: 'Talk About Multi Cuisine Restaurant and Bar',
  //     address:
  //       'Plot No. P-10, MIDC Road, Phase 1, Hinjawadi Rajiv Gandhi Infotech Park, Hinjawadi, Pune, Maharashtra 411057',
  //     image: require('../../asset/restaurants/5.jpg'),
  //     rating: 4,
  //     reviews: 10,
  //     menu: [''],
  //     distance: calculateDistance(lat, long, 18.5868214, 73.7365972, 'km'),
  //   },
  // ];

  const dishes = [
    {
      name: 'Noodles',
      image: require('../../asset/noodles.jpg'),
    },
    {
      name: 'Fried Chicken',
      image: require('../../asset/fried-chicken.jpg'),
    },
    {
      name: 'Burger',
      image: require('../../asset/burger.png'),
    },
    {
      name: 'Sandwich',
      image: require('../../asset/sandwich.png'),
    },
    {
      name: 'Non Veg',
      image: require('../../asset/nonveg.png'),
    },
  ];

  function truncateText(text: string, limit: number) {
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }

  async function getAreaName(lat: number, long: number) {
    try {
      const response = await fetch(
        'https://nominatim.openstreetmap.org/reverse?format=json&lat=' +
          lat +
          '&lon=' +
          long,
      );
      console.log(response);
      const {address} = response.data;
      const area = address.locality || address.city;
      setLocation(area);
    } catch (error) {
      console.log('Error while fetching area name:', error);
    }
  }

  async function updateToken() {
    let token = await getToken();
    if (token) {
      await firestore()
        .collection('tokens')
        .doc('tokensData')
        .update({
          user: token,
        })
        .then(() => {
          console.log('Token updated');
        });
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

  function openHotel(data) {
    navigation.navigate('Hotel', data);
  }

  async function getRestaurants() {
    try {
      const response = await fetch('http://deshmukh.pythonanywhere.com/hotels');
      const data = await response.json();
      setRestaurants(data);
    } catch (error) {
      console.log('Error retrieving restaurants:', error);
    }
  }

  function logout() {
    ToastAndroid.show('Order Placed Successfully', ToastAndroid.SHORT);
    navigation.dispatch(StackActions.replace('Login'));
  }

  useEffect(() => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    )
      .then(granted => {
        console.log(granted);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(position => {
            console.log(position);
            const {latitude, longitude} = position.coords;
            setLat(latitude);
            setLong(longitude);
          });
        } else {
          console.log('location permission denied');
        }
      })
      .catch(err => {
        console.log(err);
      });
    //updateToken();
    getRestaurants();
  }, []);

  return (
    <ScrollView>
      <View style={styles.profileCard}>
        <Image
          source={avatar}
          style={{width: 50, height: 50, borderRadius: 50}}
        />
        <View style={{flexDirection: 'column', marginLeft: 10}}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: 'black',
            }}>
            User Name
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="map-pin" size={20} color="red" style={{marginTop: 5}} />
            <Text style={{marginLeft: 10}}>Hinjewadi, Pune</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={{color: 'white'}}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            marginLeft: 10,
            marginTop: 20,
            color: 'black',
          }}>
          Top Dishes
        </Text>
        <ScrollView horizontal={true}>
          <View style={{flexDirection: 'row'}}>
            {dishes.map((dish, index) => (
              <View style={{margin: 10}} key={index}>
                <Image source={dish.image} style={styles.dishImage} />
                <Text style={{textAlign: 'center'}}>{dish.name}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginLeft: 10,
              marginTop: 20,
              color: 'black',
            }}>
            5 restaurants to explore
          </Text>
          {restaurants.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => openHotel(item)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 10,
                  margin: 10,
                }}>
                <View style={{elevation: 10}}>
                  <Image
                    source={{
                      uri:
                        'http://deshmukh.pythonanywhere.com/restaurant-images/' +
                        item[3],
                    }}
                    style={{width: 100, height: 100, borderRadius: 5}}
                  />
                </View>

                <View style={{flexDirection: 'column', marginLeft: 10}}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: 'black',
                    }}>
                    {item[1]}
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon name="map-pin" size={20} color="red" />
                    <Text style={{marginLeft: 10}}>
                      {truncateText(item[2], 30)}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text>
                      Distance:{' '}
                      {calculateDistance(lat, long, item[6], item[7], 'km')} Km
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
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
  dishImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: 'white',
  },
});

export default User;
