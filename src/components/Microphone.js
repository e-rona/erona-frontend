import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import MicIcon from '../assets/icons/mic.png';
import * as colors from '../themes/colors';

export const MicroPhone = ({isTalking}) => {
  return <View style={styled.container}></View>;
};

const styled = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.main,
  },
});
