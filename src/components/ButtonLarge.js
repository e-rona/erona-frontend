import React from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';
import * as colors from '../themes/colors';

export const ButtonLarge = ({label, onPress, style}) => {
  return (
    <Pressable style={{...styled.container, ...style}} onPress={onPress}>
      <Text style={styled.text}>{label}</Text>
    </Pressable>
  );
};

const styled = StyleSheet.create({
  container: {
    backgroundColor: colors.main,
    paddingHorizontal: 48,
    paddingVertical: 24,
    borderRadius: 48,
    alignSelf: 'center',
  },
  text: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 24,
    lineHeight: 32,
    color: colors.white,
  },
});
