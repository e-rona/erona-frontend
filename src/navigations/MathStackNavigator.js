import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {MathInit, MathPlay} from '../screens/math';

const Stack = createStackNavigator();

export const MathStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false, cardStyle: {backgroundColor: '#fff'}}}
      initialRouteName="MathInit">
      <Stack.Screen name="MathInit" component={MathInit} />
      <Stack.Screen name="MathPlay" component={MathPlay} />
    </Stack.Navigator>
  );
};
