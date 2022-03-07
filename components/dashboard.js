// components/dashboard.js

import React, { useState, useEffect } from 'react';
import { List, Divider } from 'react-native-paper';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import firebase from '../database/firebase';

import Loading from './loading';

export default function Dashboard({navigation}) {

  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebase.firestore()
      .collection('THREADS')
      .orderBy('latestMessage.createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const threads = querySnapshot.docs.map((documentSnapshot) => {
          return {
            _id: documentSnapshot.id,
            name: '',
            password: '',
            latestMessage: {
              text: ''
            },
            ...documentSnapshot.data(),
          };
        });

        setThreads(threads);

        if (loading) {
          setLoading(false);
        }
      });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Loading />;
  }
    return (
      <View style={styles.container}>
        <FlatList
          data={threads}
          keyExtractor={item => item._id}
          ItemSeparatorComponent={() => <Divider />}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('PasswordRoom', { thread: item })}
            >
              <List.Item
                title={item.name}
                description={item.latestMessage.text}
                titleNumberOfLines={1}
                titleStyle={styles.listTitle}
                descriptionStyle={styles.listDescription}
                descriptionNumberOfLines={1}
              />
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  listTitle: {
    fontSize: 22,
  },
  listDescription: {
    fontSize: 16,
  },
});