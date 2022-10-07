import React from 'react';
import {View, Pressable, TouchableOpacity, StyleSheet, Image} from 'react-native';
import MicIcon from '../assets/icons/mic.png';
import * as colors from '../themes/colors';

export const MicroPhone = ({isTalking, onPress}) => {
  return (
    <Pressable style={[styled.container, {backgroundColor: isTalking ? colors.main : colors.gray300}]} onPress={onPress}>
      <Image style={styled.micImg} source={require('../assets/icons/mic.png')} />
    </Pressable>
  );
};

const styled = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micImg: {
    width: 48,
    height: 48,
  },
});
