import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Tts from 'react-native-tts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import {InitText} from '../../components';

export const MovieInit = () => {
  const [quizType, setQuizType] = useState('');

  const navigation = useNavigation();
  const getGame = async token => {
    const {data} = await axios.get('http://43.201.76.241:8080/api/query/game-list', {
      headers: {
        accessToken: token,
      },
    });
    const quizList = data.gameList.slice(0, 3);

    Tts.addEventListener('tts-finish', () => {
      navigation.navigate('MoviePlay', {
        quizList,
      });
    });
    const quizType = data.gameCode === 0 ? '사칙연산 게임을' : data.gameCode === 1 ? '사자성어 이어 말하기를' : '영화 명대사 듣고 제목 맞추기를';
    setQuizType(quizType);
    Tts.speak(quizType + '시작합니다.', {
      rate: 0.4,
      androidParams: {
        KEY_PARAM_PAN: -1,
        KEY_PARAM_VOLUME: 1,
        KEY_PARAM_STREAM: 'STREAM_NOTIFICATION',
      },
    });
  };

  useEffect(() => {
    AsyncStorage.getItem('accessToken').then(token => {
      getGame(token);
    });
    // 말이 끝나면 다음 화면으로 이동
  }, []);

  return (
    <SafeAreaView style={styled.container}>
      <InitText game={quizType} style={{marginLeft: 32, marginTop: 200}} />
    </SafeAreaView>
  );
};

const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
});
