import React, { useState, useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import App from '../App';
import firebase from '../database/firebase';
import HomeStack from './HomeStack';
import { AuthContext } from './AuthProvider';
import Loading from '../components/loading';
import AuthStack from './AuthStack';

export default function Routes() {
    const { user, setUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [initializing, setInitializing] = useState(true);
  
    // Handle user state changes
    function onAuthStateChanged(user) {
      setUser(user);
      if (initializing) setInitializing(false);
      setLoading(false);
    }
  
    useEffect(() => {
      const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
      return subscriber; // unsubscribe on unmount
    }, []);
  
    if (loading) {
      return <Loading />;
    }
  
    return (
      <NavigationContainer>
        {user ? <HomeStack /> : <AuthStack />}
      </NavigationContainer>
    );
  }