import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../components/login';
import Signup from '../components/signup';
import Dashboard from '../components/dashboard';
import Draw from '../components/draw';
import Chat from '../components/chat';

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
      <Stack.Navigator
        initialRouteName="Signup"
        screenOptions={{
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#33C7FF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen 
          name="Signup" 
          component={Signup} 
          options={{ title: 'Signup' }}
        />       
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={
            {title: 'Login'},
            {headerLeft: null} 
          }
        />
        <Stack.Screen 
        name="Dashboard" 
        component={Dashboard} 
        options={
          { title: 'Dashboard' },
          {headerLeft: null} 
        }
        />
        <Stack.Screen 
        name="Draw" 
        component={Draw} 
        options={
          { title: 'Draw' },
          {headerLeft: null} 
        }
        />
        <Stack.Screen 
        name="Chat" 
        component={Chat} 
        options={
          { title: 'Chat' },
          {headerLeft: null} 
        }
        />
      </Stack.Navigator>
  );
}