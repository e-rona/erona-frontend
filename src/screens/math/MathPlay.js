import React, {useEffect, useState, useCallback} from 'react';
import {SafeAreaView, View, Text, StyleSheet} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import Tts from 'react-native-tts';
import RNVoice from '@react-native-voice/voice';

import {MicroPhone} from '../../components';
import {getGame, queryKeys} from '../../api';
import {useSyncState} from '../../utils';

export const MathPlay = () => {
  const [isRecord, setIsRecord] = useState(false); // 마이크 켜져 있는지
  const [quizList, setQuizList] = useState([]); // 퀴즈 목록
  const [quizIndex, setQuizIndex] = useState(0); // 현재 퀴즈 인덱스
  const [userAnswer, setUserAnswer] = useState('');

  useQuery(queryKeys.game, getGame, {
    onSuccess: data => {
      setQuizList(data.gameList);
      readQuiz(data.gameList[0].quiz);
    },
  });

  const onPressMic = () => {
    if (isRecord) {
      setIsRecord(false);
      RNVoice.stop();
    } else {
      setIsRecord(true);
      recordVoice();
    }
  };
  const readQuiz = quiz => {
    Tts.speak(quiz, {
      rate: 0.38,
    });
  };

  const testAnswer = (userAnswer, quizList, quizIndex) => {
    if (userAnswer == quizList[quizIndex].answer) {
      console.log('맞았습니다');
      readQuiz(quizList[quizIndex + 1].quiz);
      setQuizIndex(quizIndex => quizIndex + 1);
    } else {
      console.log('틀렸습니다');
    }
  };

  const _onSpeechStart = () => {
    console.log('onSpeechStart');
  };
  const _onSpeechEnd = () => {
    console.log('onSpeechEnd');
    setIsRecord(false);
  };
  const _onSpeechResults = event => {
    const userSpoken = event.value[0];
    console.log(userSpoken);
    setUserAnswer(userSpoken);

    setTimeout(() => {
      setUserAnswer(userAnswer => {
        console.log('userAnswer : ', userAnswer);
        console.log('userSpoken : ', userSpoken);
        if (userAnswer == userSpoken) {
          console.log('Processed transcript (iOS): ', userSpoken);
          setIsRecord(false);

          testAnswer(userAnswer, quizList, quizIndex);
          RNVoice.destroy().then(recordVoice);
          return '';
        }

        return userAnswer;
      });
    }, 500);
  };

  const _onSpeechError = () => {};
  const _onSpeechRecognized = () => {};

  const recordVoice = () => {
    RNVoice.start('ko-KR', {
      RECOGNIZER_ENGINE: 'GOOGLE',
      EXTRA_PARTIAL_RESULTS: true,
    });
  };

  useEffect(() => {
    RNVoice.onSpeechStart = _onSpeechStart;
    RNVoice.onSpeechEnd = _onSpeechEnd;
    RNVoice.onSpeechError = _onSpeechError;
    RNVoice.onSpeechRecognized = _onSpeechRecognized;
    RNVoice.onSpeechResults = _onSpeechResults;

    // RNVoice.onSpeechPartialResults = _onSpeechPartialResults;

    Tts.addEventListener('tts-finish', () => {
      setIsRecord(true);
      recordVoice();
    });

    return () => {
      Tts.removeEventListener('tts-finish');
      RNVoice.destroy().then(RNVoice.removeAllListeners);
    };
  }, []);

  return (
    <SafeAreaView style={styled.container}>
      <View style={styled.quizTextContainer}>
        <Text style={styled.quizText}>{isRecord ? userAnswer : quizList.length > 0 && quizList[quizIndex].quiz}</Text>
      </View>
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
    fontSize: 72,
    marginRight: 12,
  },
  micContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 48,
  },
});
