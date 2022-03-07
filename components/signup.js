// components/signup.js

import React, { useState, useContext } from 'react';
import { StyleSheet, Image, Text, View, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { auth } from '../database/firebase';
import { AuthContext } from '../navigation/AuthProvider';


export default function Signup({navigation}) {

  const { register } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // constructor() {
  //   super();
  //   this.state = { 
  //     displayName: '',
  //     email: '', 
  //     password: '',
  //     isLoading: false
  //   }
  // }

  // updateInputVal = (val, prop) => {
  //   const state = this.state;
  //   state[prop] = val;
  //   this.setState(state);
  // }

  // registerUser = () => {
  //   if(this.state.email === '' && this.state.password === '') {
  //     Alert.alert('Enter details to signup!')
  //   } else {
  //     this.setState({
  //       isLoading: true,
  //     })
  //     firebase
  //     auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
  //     .then((userCredential) => {
  //       var user = userCredential.user;
  //       res.user.updateProfile({
  //         displayName: this.state.displayName
  //       })
  //       console.log('User registered successfully!')
  //       this.setState({
  //         isLoading: false,
  //         displayName: '',
  //         email: '', 
  //         password: ''
  //       })
  //       this.props.navigation.navigate('Login')
  //     })
  //     .catch(error => {
  //       console.log("ERROR", error)
  //       this.setState({ errorMessage: error.message, isLoading:false })
  //     })      
  //   }
  // }

  // render() {
  //   if(this.state.isLoading){
  //     return(
  //       <View style={styles.preloader}>
  //         <ActivityIndicator size="large" color="#9E9E9E"/>
  //       </View>
  //     )
  //   }    
    return (
      <View style={styles.container}>
        <Image
          style={styles.tinyLogo}
          source={require('../assets/pictlonis_logo.png')}
        />
        <TextInput
          style={styles.inputStyle}
          placeholder="Name"
          value={name}
          onChangeText={userName => setName(userName)}
        />      
        <TextInput
          style={styles.inputStyle}
          placeholder="Email"
          value={email}
          onChangeText={userEmail => setEmail(userEmail)}
        />
        <TextInput
          style={styles.inputStyle}
          placeholder="Password"
          value={password}
          onChangeText={userPassword => setPassword(userPassword)}
          maxLength={15}
          secureTextEntry={true}
        />   
        <Button
          color="#33C7FF"
          title="Signup"
          onPress={() => register(email, password)}
        />

        <Text 
          style={styles.loginText}
          onPress={() => navigation.navigate('Login')}>
          Already Registered? Click here to login
        </Text>                          
      </View>
    );
  }
//}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: 35,
    backgroundColor: '#fff'
  },
  tinyLogo: {
    width: 350,
    height: 150,
    marginBottom: 150
  },
  inputStyle: {
    width: '100%',
    marginBottom: 15,
    paddingBottom: 15,
    alignSelf: "center",
    borderColor: "#ccc",
    borderBottomWidth: 1
  },
  loginText: {
    color: '#33C7FF',
    marginTop: 25,
    textAlign: 'center'
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  }
});