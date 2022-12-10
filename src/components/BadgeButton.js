import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import * as colors from '../themes/colors';

export const BadgeButton = ({label, onPress, detail}) => {
  return (
    <Pressable style={styled.container} onPress={onPress}>
      <Text style={styled.text}>{label}</Text>
      {detail && <Text style={styled.detailText}>{detail}</Text>}
    </Pressable>
  );
};

const styled = StyleSheet.create({
  container: {
    shadowColor: '#000',
    width: '100%',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 20,
  },
  text: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    lineHeight: 24,
  },
  detailText: {
    marginTop: 8,
    color: colors.gray400,
    lineHeight: 20,
  },
});
