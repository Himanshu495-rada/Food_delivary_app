import React, {useEffect} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {StackActions} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import logo from '../../asset/BHAI.png';

function SplashScreen({navigation}) {
  useEffect(() => {
    setTimeout(() => {
      navigation.dispatch(StackActions.replace('Home'));
    }, 3000);
  }, []);

  return (
    <LinearGradient
      colors={['#fdcc9b', '#fb9937', '#de7104']}
      style={styles.linearGradient}>
      <Image
        source={logo}
        style={{width: 200, height: 200, borderRadius: 100}}
      />
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: 'white',
          marginTop: 30,
          marginBottom: 50,
        }}>
        Bharat Highway Assistance and integrator
      </Text>
    </LinearGradient>
  );
}

var styles = StyleSheet.create({
  linearGradient: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
});

export default SplashScreen;
