import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Success} from '../screens';
import {Home} from '../screens';
import FaceRecognition from '../screens/FaceRrecognition';
import {MathStackNavigator} from './MathStackNavigator';
import {CurrentPosition} from '../screens/CurrentPosition';

const Stack = createStackNavigator();

export const RootStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false, cardStyle: {backgroundColor: '#fff'}}} initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="FaceRecognition" component={FaceRecognition} />
      <Stack.Screen name="MathStackNavigator" component={MathStackNavigator} />
      <Stack.Screen name="Success" component={Success} />
      <Stack.Screen name="CurrentPosition" component={CurrentPosition}></Stack.Screen>
    </Stack.Navigator>
  );
};
