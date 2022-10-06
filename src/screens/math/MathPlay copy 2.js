import React, {useState, useEffect, useCallback} from 'react';
import {SafeAreaView, View, Text, StyleSheet} from 'react-native';
import Tts from 'react-native-tts';
import RNVoice from '@react-native-voice/voice';
//import {extractNumber} from 'kor-to-number';
const {extractNumber} = require('kor-to-number');

import {MicroPhone} from '../../components';

const operators = ['+', '-', '*', '/'];
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
  // ******************** states ********************
  const [rightAnswer, setRightAnswer] = useState(0); // 맞힌 정답의 개수
  const [userAnswer, setUserAnswer] = useState(0); // 사용자가 말한 정답
  const [quizzes, setQuizzes] = useState([
    {num1: '0', num2: '0', operator: '+', operatorKo: '더하기', answer: 0},
    {num1: '0', num2: '0', operator: '+', operatorKo: '더하기', answer: 0},
    {num1: '0', num2: '0', operator: '+', operatorKo: '더하기', answer: 0},
  ]); // 사칙연산 퀴즈
  const [quizIndex, setQuizIndex] = useState(-1); // 현재 퀴즈 번호
  const [isRecord, setIsRecord] = useState(false); // 녹음이 시작됐는지
  const [partialResult, setPartialResult] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [answer, setAnswer] = useState(0);

  // ******************** callbacks ********************
  const _onSpeechStart = useCallback(() => {
    setUserAnswer(0);
  }, []);

  const _onSpeechEnd = useCallback(e => {
    //console.log('on speech end :', e);
  }, []);

  const _onSpeechResults = useCallback(
    e => {
      //console.log(partialResult);
      const splitted = e.value[0].split(' ');
      const lastword = splitted[splitted.length - 1];

      const wordToNumber = extractNumber(lastword)[0];

      setPartialResult(wordToNumber);
      console.log(lastword);

      // 0.5초마다 이전 숫자랑 현재 숫자 비교
      setTimeout(() => {
        setPartialResult(partialResult => {
          // 말이 끝났으면
          if (wordToNumber === partialResult) {
            console.log('Processed transcript (iOS): ', wordToNumber);
            setPartialResult(wordToNumber);
            // Reset the transcript
            setIsRecord(false);
            setIsDone(true);

            RNVoice.destroy();
          }
          return partialResult;
        });
      }, 500);
    },
    [partialResult],
  );

  const _onSpeechError = useCallback(e => {
    //console.log('_onSpeechError');
    //console.log(e.error);
  }, []);

  const _onSpeechRecognized = useCallback(event => {
    //console.log('recognized :', event);
  }, []);

  const recordVoice = useCallback(() => {
    RNVoice.start('ko-KR');
  }, []);

  const onPressMic = useCallback(() => {
    if (isRecord) {
      setIsRecord(false);
      RNVoice.stop();
    } else {
      setIsRecord(true);

      recordVoice();
    }
  }, [isRecord, recordVoice]);

  // ******************** useEffects ********************
  useEffect(() => {
    // request audio permission on android
    const tempQuizzes = [];

    // make quizzes
    for (var i = 0; i < QUIZ_NUM; i++) {
      const num1 = (Math.floor(Math.random() * 4) + 1).toString();
      const num2 = (Math.floor(Math.random() * 4) + 1).toString();
      const operatorIdx = Math.floor(Math.random() * 10) % 1;
      const operatorKo = operatorsKorean[operatorIdx];
      const operator = operators[operatorIdx];
      const answer = eval(num1 + operator + num2);
      if (i == 0) {
        setAnswer(answer);
      }

      tempQuizzes[i] = {num1, num2, operator, operatorKo, answer};
    }
    // set quizzes
    setQuizzes(tempQuizzes);
    // set quiz index to zero
    setQuizIndex(0);

    // bind handlers to react-native-voice
    RNVoice.onSpeechStart = _onSpeechStart;
    RNVoice.onSpeechEnd = _onSpeechEnd;
    RNVoice.onSpeechResults = _onSpeechResults;
    RNVoice.onSpeechError = _onSpeechError;
    RNVoice.onSpeechRecognized = _onSpeechRecognized;

    // remove listers when component is unmounted
    return () => {
      RNVoice.destroy().then(RNVoice.removeAllListeners);
    };
  }, []);

  useEffect(() => {
    // return when quiz is not created
    if (quizIndex < 0) return;
    console.log('quizIndex: ', quizIndex);

    Tts.speak(quizzes[quizIndex].num1 + quizzes[quizIndex].operatorKo + quizzes[quizIndex].num2 + '는?', TTS_ANDROID_PARAMS);
    Tts.addEventListener('tts-finish', event => {
      // set record on when quiz notification is done
      setIsRecord(true);
      recordVoice();
    });
  }, [quizIndex]);

  useEffect(() => {
    console.log('done');
  }, [isDone]);

  return (
    <SafeAreaView style={styled.container}>
      <View style={styled.quizTextContainer}>
        <Text style={styled.quizText}>{quizzes[quizIndex]?.num1}</Text>
        <Text style={styled.quizText}>{quizzes[quizIndex]?.operator}</Text>
        <Text style={styled.quizText}>{quizzes[quizIndex]?.num2}</Text>
      </View>
      <Text>{isRecord ? '녹음중 ' : '녹음 멈춤'}</Text>
      <View style={styled.micContainer}>{<MicroPhone isTalking={isRecord} onPress={onPressMic} />}</View>
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
    paddingBottom: 24,
  },
});
