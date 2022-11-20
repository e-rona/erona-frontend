import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {MovieInit, MoviePlay} from '../screens/movie';

const Stack = createStackNavigator();

export const MovieStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false, cardStyle: {backgroundColor: '#fff'}}} initialRouteName="MovieInit">
      <Stack.Screen name="MovieInit" component={MovieInit} />
      <Stack.Screen name="MoviePlay" component={MoviePlay} />
    </Stack.Navigator>
  );
};
