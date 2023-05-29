import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import wallpaper from '../../asset/wallpaper.jpg';

function Home({navigation}) {
  function roomService() {
    Alert.alert('Room Service', 'Room Service is not available at the moment');
  }

  function autoService() {
    Alert.alert('Auto Service', 'Auto Service is not available at the moment');
  }

  function foodService() {
    navigation.navigate('Login');
  }

  async function permission() {
    let version: number = Number(Platform.Version);
    if (version > 32) {
      console.log('Request permission');
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    } else {
      console.log('No permission required');
    }
  }

  useEffect(() => {
    permission();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={wallpaper}
        style={{
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        blurRadius={3}>
        <TouchableOpacity style={styles.buttonContainer} onPress={foodService}>
          <Text style={styles.text}>Food</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={roomService}>
          <Text style={styles.text}>Accomodation</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainer} onPress={autoService}>
          <Text style={styles.text}>Automobile</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  buttonContainer: {
    backgroundColor: '#de7104',
    width: 150,
    height: 150,
    borderRadius: 75,
    marginVertical: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
});

export default Home;
