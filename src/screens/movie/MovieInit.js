import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Tts from 'react-native-tts';

import {InitText} from '../../components';

export const MovieInit = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // 말이 끝나면 다음 화면으로 이동
    Tts.addEventListener('tts-finish', () => {
      navigation.navigate('MoviePlay');
    });
  }, []);
  useEffect(() => {
    Tts.speak('영화 명대사 듣고 제목 맞추기를 시작합니다.', {
      rate: 0.4,
      androidParams: {
        KEY_PARAM_PAN: -1,
        KEY_PARAM_VOLUME: 1,
        KEY_PARAM_STREAM: 'STREAM_NOTIFICATION',
      },
    });

    return () => {
      Tts.removeEventListener('tts-finish');
    };
  }, []);
  return (
    <SafeAreaView style={styled.container}>
      <InitText game="영화 명대사 듣고 제목 맞추기를" style={{marginLeft: 32, marginTop: 200}} />
    </SafeAreaView>
  );
};

const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
});
