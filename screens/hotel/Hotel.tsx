import React, {useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

function Hotel({route, navigation}) {
  const hotel = route.params;
  const [menu, setMenu] = React.useState([]);
  const [cart, setCart] = React.useState([]);

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

  function goBack() {
    navigation.goBack();
  }

  async function getMenu() {
    const response = await fetch(
      'http://deshmukh.pythonanywhere.com/menu/' + hotel[0],
    );

    const data = await response.json();
    console.log(data);
    setMenu(data);
    console.log(
      'http://deshmukh.pythonanywhere.com/food-images/' + menu[11][4],
    );
  }

  function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  async function addToCart(item: any) {
    setCart([...cart, item]);
  }

  function openCart() {
    navigation.navigate('Cart', cart);
  }

  useEffect(() => {
    getMenu();
    //console.log(hotel);
  }, []);

  return (
    <ScrollView>
      <View style={{marginTop: 20, marginLeft: 20}}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={goBack}>
            <Icon name="arrow-left" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cart} onPress={openCart}>
            <Text>Cart: {cart.length}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.hotelCard}>
          <Text style={{fontSize: 30, fontWeight: 'bold', marginTop: 10}}>
            {hotel[1]}
          </Text>
          <Text style={{fontSize: 15, marginTop: 10}}>{hotel[2]}</Text>
          <Text style={{fontSize: 15, marginTop: 10}}>
            {hotel[4]} <Icon name="star" size={15} color="orange" />
            {'   '}
            {hotel[5]} reviews
          </Text>
        </View>
        <TextInput placeholder="Search for dishes" style={styles.search} />
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            marginLeft: 10,
            color: 'black',
          }}>
          Recommended ({menu.length})
        </Text>
        {menu.map((item, index) => {
          return (
            <View key={index}>
              <View style={styles.itemCard} key={index}>
                <View>
                  <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                    {capitalizeFirstLetter(item[2])}
                  </Text>
                  <Text style={{fontSize: 15}}>Price: {item[3]} ₹</Text>
                </View>

                <View style={{marginLeft: 'auto', alignItems: 'center'}}>
                  <Image
                    source={{
                      uri:
                        'http://deshmukh.pythonanywhere.com/food-images/' +
                        item[4],
                    }}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 10,
                    }}
                  />
                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => addToCart(item)}>
                    <Text style={styles.addBtnText}>ADD</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.line} />
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = {
  line: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    width: '90%',
    alignSelf: 'center',
    marginRight: 20,
  },
  hotelCard: {
    width: '90%',
    height: 200,
    borderRadius: 10,
    margin: 10,
    padding: 10,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  search: {
    width: '90%',
    height: 50,
    borderRadius: 10,
    margin: 10,
    padding: 10,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemCard: {
    width: '90%',
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    margin: 10,
  },
  cart: {
    width: 70,
    height: 30,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'green',
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  addBtn: {
    width: 60,
    height: 20,
    backgroundColor: 'white',
    elevation: 5,
    borderRadius: 5,
    marginTop: -10,
  },
  addBtnText: {
    textAlign: 'center',
    color: 'green',
    fontWeight: 'bold',
  },
};

export default Hotel;
