

import React, { useState } from 'react';
import { View, StyleSheet, Button, TextInput, Dimensions } from 'react-native';
import { IconButton, Title } from 'react-native-paper';
import firebase from '../database/firebase';

const { width, height } = Dimensions.get('screen');

export default function AddRoomScreen({ navigation }) {
  const [roomName, setRoomName] = useState('');
  const [passwordName, setPasswordName] = useState('');
  
  
function handleButtonPress() {
  if (roomName.length > 0) {
    firebase.firestore()
      .collection('THREADS')
      .add({
        name: roomName,
        password: passwordName,
        latestMessage: {
          text: `You have joined the room ${roomName}.`,
          createdAt: new Date().getTime()
        }
      })
      .then(docRef => {
        docRef.collection('MESSAGES').add({
          text: `You have joined the room ${roomName}.`,
          createdAt: new Date().getTime(),
          system: true
        });
        navigation.navigate('Home');
      });
  }
}

  return (
    <View style={styles.rootContainer}>
      <View style={styles.closeButtonContainer}>
        <IconButton
          icon='close-circle'
          size={36}
          color='#33C7FF'
          onPress={() => navigation.goBack()}
        />
      </View>
      <View style={styles.innerContainer}>
        <Title style={styles.title}>Create a new chat room</Title>
        <TextInput
          style={styles.input}
          placeholder='Game Name'
          value={roomName}
          onChangeText={(text) => setRoomName(text)}
          clearButtonMode='while-editing'
        />
        <TextInput
          style={styles.input}
          placeholder='Password Game'
          value={passwordName}
          onChangeText={(text) => setPasswordName(text)}
          clearButtonMode='while-editing'
        />
        <Button
          style={styles.button}
          contentStyle={styles.buttonContainer}
          title='Create'
          mode='contained'
          labelStyle={styles.buttonLabel}
          onPress={() => handleButtonPress()}
          disabled={roomName.length === 0}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 30,
    right: 0,
    zIndex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  buttonLabel: {
    fontSize: 22,
  },
  button: {
    marginTop: 10
  },
  buttonContainer: {
    width: width / 2,
    height: height / 15
  },
  input: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    width: width / 1.5,
    height: height / 15,
    borderColor: "#ccc",
    borderBottomWidth: 1
  }
});