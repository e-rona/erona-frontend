import React from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';
import * as colors from '../themes/colors';

export const ButtonSmall = ({label, onPress, style}) => {
  return (
    <Pressable style={{...styled.container, ...style}} onPress={onPress}>
      <Text style={styled.text}>{label}</Text>
    </Pressable>
  );
};

const styled = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.main,
  },
  text: {
    color: colors.main50,
    fontFamily: 'Pretendard-Bold',
    fontSize: 16,
    lineHeight: 24,
  },
});
