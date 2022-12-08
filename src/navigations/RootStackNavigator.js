import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Success, Home, CurrentPosition, FaceRecognition, Badge} from '../screens';
import {MovieStackNavigator} from './MovieStackNavigator';

const Stack = createStackNavigator();

export const RootStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false, cardStyle: {backgroundColor: '#fff'}}} initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="FaceRecognition" component={FaceRecognition} />
      <Stack.Screen name="MovieStackNavigator" component={MovieStackNavigator} />
      <Stack.Screen name="Success" component={Success} />
      <Stack.Screen name="CurrentPosition" component={CurrentPosition} />
      <Stack.Screen name="Badge" component={Badge} />
    </Stack.Navigator>
  );
};
