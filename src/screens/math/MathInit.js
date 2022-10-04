import React, {useCallback} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {InitText} from '../../components';

export const MathInit = () => {
  return (
    <SafeAreaView style={styled.container}>
      <InitText game="사칙연산 게임" style={{marginLeft: 32, marginTop: 200}} />
    </SafeAreaView>
  );
};

styled = StyleSheet.create({
  container: {
    flex: 1,
  },
});
