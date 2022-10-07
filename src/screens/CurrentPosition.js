import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

export const CurrentPosition = () => {
  return (
    <View style={styled.container}>
      <Text>현재 위치</Text>
    </View>
  );
};

const styled = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
