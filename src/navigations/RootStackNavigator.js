import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Success} from '../screens';
import {Login} from '../screens/Login';
import {SignUp} from '../screens/SignUp';
import {Home} from '../screens';
import FaceRecognition from '../screens/FaceRrecognition';
import {MovieStackNavigator} from './MovieStackNavigator';
import {CurrentPosition} from '../screens/CurrentPosition';

const Stack = createStackNavigator();

export const RootStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false, cardStyle: {backgroundColor: '#fff'}}} initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="FaceRecognition" component={FaceRecognition} />
      <Stack.Screen name="MovieStackNavigator" component={MovieStackNavigator} />
      <Stack.Screen name="Success" component={Success} />
      <Stack.Screen name="CurrentPosition" component={CurrentPosition} />
    </Stack.Navigator>
  );
};
