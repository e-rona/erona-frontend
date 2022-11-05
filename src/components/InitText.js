import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export const InitText = ({game, style}) => {
  return (
    <View style={style}>
      <Text style={styled.text}>{game}</Text>
      <Text style={styled.text}>시작합니다</Text>
    </View>
  );
};

const styled = StyleSheet.create({
  text: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 32,
    lineHeight: 42,
  },
});
