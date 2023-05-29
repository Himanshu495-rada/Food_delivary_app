import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  AppRegistry,
  PermissionsAndroid,
  ToastAndroid,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
import wallpaper from '../../asset/wallpaper.jpg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import {REACT_APP_URL} from '@env';
import auth from '@react-native-firebase/auth';

function Login({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [invalidLogin, setInvalidLogin] = useState(false);
  const [press, setPress] = useState(true);
  const [signupPress, setSignupPress] = useState(false);

  async function login() {
    console.log('login');

    const response = await fetch('http://deshmukh.pythonanywhere.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email: email, password: password}),
    });

    const data = await response.json();

    if (response.ok) {
      if (data.user_login) {
        ToastAndroid.show('Login successful', ToastAndroid.SHORT);
        AsyncStorage.setItem('loginData', JSON.stringify({email, password}));
        navigation.navigate('User');
      } else if (data.owner_login) {
        ToastAndroid.show('Login successful', ToastAndroid.SHORT);
        navigation.navigate('Owner');
      } else {
        setInvalidLogin(true);
      }
    }

    // auth()
    //   .signInWithEmailAndPassword(email, password)
    //   .then(() => {
    //     ToastAndroid.show('Login successfull', ToastAndroid.SHORT);
    //     navigation.navigate('User');
    //   })
    //   .catch(error => {
    //     setInvalidLogin(true);
    //   });
  }

  async function signup() {
    if (password !== confirmPassword) {
      Alert.alert('Password not match');
      return;
    }
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        ToastAndroid.show('Register Success', ToastAndroid.SHORT);
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          ToastAndroid.show(
            'That email address is already in use!',
            ToastAndroid.SHORT,
          );
        } else if (error.code === 'auth/invalid-email') {
          ToastAndroid.show(
            'That email address is invalid!',
            ToastAndroid.SHORT,
          );
        } else {
          ToastAndroid.show('Register Failed', ToastAndroid.SHORT);
        }
      });
    setSignupPress(false);
  }

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
        <View style={styles.formContainer}>
          {!signupPress ? (
            <View style={{alignItems: 'center'}}>
              <Text style={styles.title}>LOGIN</Text>

              <View style={styles.inputContainer}>
                <Image
                  source={require('../../asset/person-circle.jpg')}
                  style={styles.icon}
                />
                <TextInput
                  placeholder="USERNAME"
                  placeholderTextColor="gray"
                  style={styles.input}
                  value={email}
                  onChangeText={text => setEmail(text)}
                  textContentType="emailAddress"
                />
              </View>

              <View style={styles.inputContainer}>
                <Image
                  source={require('../../asset/key.jpg')}
                  style={styles.icon}
                />
                <TextInput
                  placeholder="PASSWORD"
                  placeholderTextColor="gray"
                  style={styles.input}
                  value={password}
                  onChangeText={text => setPassword(text)}
                  secureTextEntry={press}
                />
                <Icon
                  name={press ? 'eye-slash' : 'eye'}
                  size={20}
                  color="#333"
                  onPress={() => setPress(!press)}
                  marginTop={5}
                />
              </View>

              <View>
                {invalidLogin ? (
                  <Text style={{color: 'red'}}>Invalid credentials</Text>
                ) : null}
              </View>

              <TouchableOpacity style={styles.btn} onPress={login}>
                <Text style={{color: 'white'}}>LOGIN</Text>
              </TouchableOpacity>

              <View style={{color: 'black'}}>
                <Text>Don't have an account?</Text>
              </View>

              <TouchableOpacity
                style={styles.btn}
                onPress={() => setSignupPress(true)}>
                <Text style={{color: 'white'}}>SIGNUP</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{alignItems: 'center'}}>
              <Text style={styles.title}>Register</Text>

              <View style={styles.inputContainer}>
                <Image
                  source={require('../../asset/person-circle.jpg')}
                  style={styles.icon}
                />
                <TextInput
                  placeholder="USERNAME"
                  placeholderTextColor="gray"
                  style={styles.input}
                  value={email}
                  onChangeText={text => setEmail(text)}
                  textContentType="emailAddress"
                />
              </View>

              <View style={styles.inputContainer}>
                <Image
                  source={require('../../asset/key.jpg')}
                  style={styles.icon}
                />
                <TextInput
                  placeholder="PASSWORD"
                  placeholderTextColor="gray"
                  style={styles.input}
                  value={password}
                  onChangeText={text => setPassword(text)}
                  secureTextEntry={press}
                />
                <Icon
                  name={press ? 'eye-slash' : 'eye'}
                  size={20}
                  color="#333"
                  onPress={() => setPress(!press)}
                  marginTop={5}
                />
              </View>
              <View style={styles.inputContainer}>
                <Image
                  source={require('../../asset/key.jpg')}
                  style={styles.icon}
                />
                <TextInput
                  placeholder="CONFIRM PASSWORD"
                  placeholderTextColor="gray"
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={text => setConfirmPassword(text)}
                  secureTextEntry={press}
                />
                <Icon
                  name={press ? 'eye-slash' : 'eye'}
                  size={20}
                  color="#333"
                  onPress={() => setPress(!press)}
                  marginTop={5}
                />
              </View>

              <TouchableOpacity style={styles.btn} onPress={signup}>
                <Text style={{color: 'white'}}>SIGNUP</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  settings: {
    position: 'absolute',
    top: 0,
    right: 0,
    marginRight: 20,
    marginTop: 20,
  },
  formContainer: {
    width: 330,
    height: 400,
    backgroundColor: 'white',
    borderRadius: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
  },
  title: {
    color: 'black',
    fontSize: 30,
    marginBottom: 20,
  },
  inputContainer: {
    width: 250,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
  },
  input: {
    width: 180,
    color: 'black',
  },
  icon: {
    width: 30,
    height: 30,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
  },
  btn: {
    backgroundColor: '#E05949',
    width: 250,
    height: 40,
    borderRadius: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
  },
});

export default Login;
