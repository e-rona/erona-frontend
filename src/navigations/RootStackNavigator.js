import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Home} from '../screens';
import FaceRecognition from '../screens/FaceRrecognition';
import {MathStackNavigator} from './MathStackNavigator';
const Stack = createStackNavigator();

export const RootStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false, cardStyle: {backgroundColor: '#fff'}}}
      initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="FaceRecognition" component={FaceRecognition} />
      <Stack.Screen name="MathStackNavigator" component={MathStackNavigator} />
    </Stack.Navigator>
  );
};
