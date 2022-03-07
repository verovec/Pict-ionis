import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from '../components/dashboard';
import AddRoomScreen from '../components/AddRoomScreen';
import { IconButton } from 'react-native-paper';
import { AuthContext } from './AuthProvider';
import RoomScreen from '../components/RoomScreen';
import PasswordRoom from '../components/passwordRoom';

const ChatAppStack = createStackNavigator();
const ModalStack = createStackNavigator();

function ChatApp() {
  const { logout } = useContext(AuthContext);
  return (
    <ChatAppStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#33C7FF',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontSize: 22,
        },
      }}
    >
       <ChatAppStack.Screen
        name='Home'
        component={Dashboard}
        options={({ navigation }) => ({
          headerRight: () => (
            <IconButton
              icon='message-plus'
              size={28}
              color='#ffffff'
              onPress={() => navigation.navigate('AddRoom')}
            />
          ),
          headerLeft: () => (
            <IconButton
              icon='logout-variant'
              size={28}
              color='#ffffff'
              onPress={() => logout()}
            />
          )
        })}
      />
      <ChatAppStack.Screen name='PasswordRoom' component={PasswordRoom}  options={({ route }) => ({ title: route.params.thread.name })} />
      <ChatAppStack.Screen name='Room' component={RoomScreen}  options={({ route }) => ({ title: route.params.thread.name })} />
    </ChatAppStack.Navigator>
  );
}

export default function HomeStack() {
  return (
    <ModalStack.Navigator mode='modal' headerMode='none'>
      <ModalStack.Screen name='ChatApp' component={ChatApp} />
      <ModalStack.Screen name='AddRoom' component={AddRoomScreen} />
    </ModalStack.Navigator>
  );
}