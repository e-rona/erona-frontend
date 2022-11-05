import React, {useEffect, useState, useCallback} from 'react';
import {SafeAreaView, View, Text, StyleSheet} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import Tts from 'react-native-tts';
import RNVoice from '@react-native-voice/voice';

import {MicroPhone} from '../../components';
import {getGame, queryKeys} from '../../api';

export const MathPlay = () => {
  const [isRecord, setIsRecord] = useState(false); // 마이크 켜져 있는지
  const [quizList, setQuizList] = useState([]); // 퀴즈 목록
  const [quizIndex, setQuizIndex] = useState(0); // 현재 퀴즈 인덱스
  const [userAnswer, setUserAnswer] = useState('');
  const [finalAnswer, setFinalAnswer] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(true);

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
    console.log('test answer');

    console.log(quizList[quizIndex].answer);
    if (userAnswer.replace(' ', '') == quizList[quizIndex].answer.replace(' ', '')) {
      console.log('맞았습니다');
      readQuiz(quizList[quizIndex + 1].quiz);
      setQuizIndex(quizIndex => quizIndex + 1);
      setIsRecord(false);
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

  const stopRecognizing = async () => {
    try {
      await RNVoice.stop();
      setIsRecord(false);
      console.log('stoppred');
    } catch (e) {
      console.error(e);
    }
  };

  const destroyRecognizing = async () => {
    try {
      await RNVoice.destroy();
      setIsRecord(false);
      console.log('destroyed');
    } catch (e) {
      console.error(e);
    }
  };
  const _onSpeechResults = event => {
    const userSpoken = event.value[0];
    console.log(userSpoken);
    // setUserAnswer(prevAnswer => {
    //   if (prevAnswer == userSpoken) {
    //     destroyRecognizing();
    //     testAnswer(userSpoken, quizList, quizIndex);
    //     return '';
    //   }
    //   return userSpoken;
    // });
    setUserAnswer(userSpoken);

    // setTimeout(() => {
    //   setUserAnswer(prevAnswer => {
    //     if (prevAnswer == userSpoken) {
    //       destroyRecognizing();

    //       console.log('Processed transcript (iOS): ', userSpoken);
    //       setFinalAnswer(userSpoken);
    //       testAnswer(userSpoken, quizList, quizIndex);
    //       return '';
    //     }
    //     return prevAnswer;
    //   });
    // }, 700);
  };
  useEffect(() => {
    const prev = userAnswer;
    setTimeout(() => {
      if (prev == userAnswer) {
        setUserAnswer('');
        console.log('done');
      }
    }, 2000);
  }, [userAnswer]);
  const _onSpeechError = () => {};
  const _onSpeechRecognized = () => {};

  const recordVoice = () => {
    RNVoice.start('ko-KR', {
      RECOGNIZER_ENGINE: 'GOOGLE',
      EXTRA_PARTIAL_RESULTS: true,
    });
  };
  useEffect(() => {
    console.log('quiz list changed');
    if (quizList.length > 0) {
      RNVoice.onSpeechResults = _onSpeechResults;
    }
  }, [quizList, quizIndex]);

  useEffect(() => {
    RNVoice.onSpeechStart = _onSpeechStart;
    RNVoice.onSpeechEnd = _onSpeechEnd;
    RNVoice.onSpeechError = _onSpeechError;
    RNVoice.onSpeechRecognized = _onSpeechRecognized;
    // RNVoice.onSpeechResults = _onSpeechResults;

    // RNVoice.onSpeechPartialResults = _onSpeechPartialResults;

    Tts.addEventListener('tts-finish', () => {
      setTimeout(() => {
        setIsRecord(true);
        recordVoice();
      }, 300);
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
