import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Home} from '../screens';
const Stack = createStackNavigator();

export const RootStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false, cardStyle: {backgroundColor: '#fff'}}}
      initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
};
