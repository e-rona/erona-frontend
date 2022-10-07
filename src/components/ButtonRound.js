import React from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';
import * as colors from '../themes/colors';

export const ButtonRound = ({label, onPress, style}) => {
  return (
    <Pressable style={{...styled.container, ...style}} onPress={onPress}>
      <Text style={styled.text}>{label}</Text>
    </Pressable>
  );
};

const styled = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.main,
  },
  text: {
    color: colors.main50,
    fontFamily: 'Pretendard-Bold',
    fontSize: 24,
    lineHeight: 32,
  },
});
