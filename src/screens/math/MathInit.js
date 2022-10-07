import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Tts from 'react-native-tts';

import {InitText} from '../../components';

export const MathInit = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // 말이 끝나면 다음 화면으로 이동
    Tts.addEventListener('tts-finish', () => {
      navigation.navigate('MathPlay');
    });
  }, []);
  useEffect(() => {
    Tts.speak('사칙연산 게임을 시작합니다', {
      rate: 0.5,
      androidParams: {
        KEY_PARAM_PAN: -1,
        KEY_PARAM_VOLUME: 1,
        KEY_PARAM_STREAM: 'STREAM_NOTIFICATION',
      },
    });

    // return () => {
    //   Tts.removeEventListener('tts-finish');
    // };
  }, []);
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
