import React, {useState, useEffect, useCallback} from 'react';
import {SafeAreaView, View, Text, StyleSheet} from 'react-native';
import Tts from 'react-native-tts';
import RNVoice from '@react-native-voice/voice';
import {useNavigation} from '@react-navigation/native';
import {extractNumber} from 'kor-to-number';

import {MicroPhone} from '../../components';
import {speechToNumber, useSyncState} from '../../utils';

const operators = ['+', '-', '*', '/'];
const operatorsKorean = ['더하기', '빼기', '곱하기', '나누기'];

const TTS_ANDROID_PARAMS = {
  rate: 0.4,
  androidParams: {
    KEY_PARAM_PAN: -1,
    KEY_PARAM_VOLUME: 1,
    KEY_PARAM_STREAM: 'STREAM_NOTIFICATION',
  },
};

const quizzes = [
  {
    num1: '3',
    num2: '5',
    answer: 8,
  },
  {
    num1: '7',
    num2: '2',
    answer: 5,
  },
  {
    num1: '3',
    num2: '1',
    answer: 4,
  },
];

export const MathPlay = () => {
  const [quizIndex, setQuizIndex] = useState(0);
  const [isRecord, setIsRecord] = useState(false);
  const [userAnswer, setUserAnswer] = useState(-1);
  const [rightAnswer, setRightAnswer] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);

  const navigation = useNavigation();

  const _onSpeechStart = useCallback(() => {}, []);

  const _onSpeechEnd = useCallback(e => {
    //console.log('on speech end :', e);
  }, []);

  const _onSpeechResults = useCallback(e => {
    //console.log(partialResult);
    const splitted = e.value[0].split(' ');
    const lastword = splitted[splitted.length - 1];

    const userSpoken = speechToNumber(lastword);

    setUserAnswer(userSpoken);

    // 0.5초마다 이전 숫자랑 현재 숫자 비교
    setTimeout(() => {
      setUserAnswer(userAnswer => {
        // 말이 끝났으면
        if (userAnswer === userSpoken) {
          console.log('Processed transcript (iOS): ', userSpoken);
          // Reset the transcript
          setIsRecord(false);
          setIsAnswered(true);
          testAnswer(userAnswer);
          RNVoice.destroy();

          return '';
        }
        return userAnswer;
      });
    }, 500);
  }, []);

  const _onSpeechError = useCallback(e => {}, []);

  const _onSpeechRecognized = useCallback(event => {}, []);
  const recordVoice = useCallback(() => {
    RNVoice.start('ko-KR');
  }, []);

  const testAnswer = useCallback(userAnswer => {
    if (quizzes[0].answer == userAnswer) {
      navigation.navigate('Success');
      setRightAnswer(rightAnswer => rightAnswer + 1);
    } else {
      console.log('틀렸습니다');
    }
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

  useEffect(() => {
    // bind handlers to react-native-voice
    RNVoice.onSpeechStart = _onSpeechStart;
    RNVoice.onSpeechEnd = _onSpeechEnd;
    RNVoice.onSpeechResults = _onSpeechResults;
    RNVoice.onSpeechError = _onSpeechError;
    RNVoice.onSpeechRecognized = _onSpeechRecognized;

    Tts.addEventListener('tts-start', event => {
      setTimeout(() => {
        if (isAnswered == false) {
          console.log('************sleeping*********');
          setIsRecord(false);
        }
      }, 5000);
    });
    Tts.addEventListener('tts-finish', event => {
      // set record on when quiz notification is done
      setIsRecord(true);
      recordVoice();
    });

    // remove listers when component is unmounted
    return () => {
      RNVoice.destroy().then(RNVoice.removeAllListeners);
    };
  }, []);

  // const readQuiz = useCallback(quizIndex => {
  //   Tts.speak(quizzes[quizIndex].num1 + '더하기' + quizzes[quizIndex].num2 + '는?');
  // }, []);
  useEffect(() => {
    console.log(quizIndex);
    Tts.speak(quizzes[quizIndex].num1 + '더하기' + quizzes[quizIndex].num2 + '는?', TTS_ANDROID_PARAMS);
  }, [quizIndex]);

  return (
    <SafeAreaView style={styled.container}>
      <View style={styled.quizTextContainer}>
        <Text style={styled.quizText}></Text>
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
    fontSize: 96,
    marginRight: 12,
  },
  micContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 48,
  },
});
