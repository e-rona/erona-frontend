import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

export const FaceRecognition = () => {
  return (
    <View style={styled.container}>
      <Text>졸음 인식</Text>
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
