import React, {useState, useEffect} from 'react';
import {SafeAreaView, View, Text, StyleSheet} from 'react-native';
import Tts from 'react-native-tts';
import RNVoice from '@react-native-voice/voice';
import {MicroPhone} from '../../components';

const operators = ['+', '-', '*', '-'];
const operatorsKorean = ['더하기', '빼기', '곱하기', '나누기'];
const QUIZ_NUM = 3;

const TTS_ANDROID_PARAMS = {
  rate: 0.4,
  androidParams: {
    KEY_PARAM_PAN: -1,
    KEY_PARAM_VOLUME: 1,
    KEY_PARAM_STREAM: 'STREAM_NOTIFICATION',
  },
};

export const MathPlay = () => {
  const [rightAnswer, setRightAnswer] = useState(0); // 맞힌 정답의 개수
  const [quizzes, setQuizzes] = useState([
    {num1: '0', num2: '0', operator: '+', operatorKo: '더하기', answer: 0},
    {num1: '0', num2: '0', operator: '+', operatorKo: '더하기', answer: 0},
    {num1: '0', num2: '0', operator: '+', operatorKo: '더하기', answer: 0},
  ]); // 사칙연산 퀴즈

  const [speakDone, setSpeakDone] = useState({
    num1: false,
    num2: false,
    operator: false,
  });
  const [quizIndex, setQuizIndex] = useState(-1);

  useEffect(() => {
    const tempQuizzes = [];
    for (var i = 0; i < QUIZ_NUM; i++) {
      const num1 = Math.floor(Math.random() * 10).toString();
      const num2 = (Math.floor(Math.random() * 9) + 1).toString();
      const operatorIdx = Math.floor(Math.random() * 10) % 4;
      const operatorKo = operatorsKorean[operatorIdx];
      const operator = operators[operatorIdx];
      const answer = eval(num1 + operator + num2);

      tempQuizzes[i] = {num1, num2, operator, operatorKo, answer};
    }
    setQuizIndex(0);
    setQuizzes(tempQuizzes);
  }, []);

  useEffect(() => {
    if (quizIndex < 0) return;

    Tts.speak(quizzes[quizIndex].num1, TTS_ANDROID_PARAMS);
    setSpeakDone(speakDone => ({...speakDone, num1: true}));

    Tts.speak(quizzes[quizIndex].operatorKo, TTS_ANDROID_PARAMS);
    setSpeakDone(speakDone => ({...speakDone, operator: true}));

    Tts.speak(quizzes[quizIndex].num2, TTS_ANDROID_PARAMS);
    setSpeakDone(speakDone => ({...speakDone, num2: true}));

    Tts.speak('는?', TTS_ANDROID_PARAMS);
  }, [quizIndex]);

  console.log(quizzes);
  return (
    <SafeAreaView style={styled.container}>
      <View style={styled.quizTextContainer}>
        <Text style={styled.quizText}>{speakDone.num1 && quizzes[quizIndex].num1}</Text>
        <Text style={styled.quizText}>{speakDone.operator && quizzes[quizIndex].operator}</Text>
        <Text style={styled.quizText}>{speakDone.num2 && quizzes[quizIndex].num2}</Text>
      </View>
      <View style={styled.micContainer}>
        <MicroPhone />
      </View>
    </SafeAreaView>
  );
};

const styled = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  quizTextContainer: {
    flexDirection: 'row',
    marginTop: 200,
  },
  quizText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 96,
    marginRight: 12,
  },
  micContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
