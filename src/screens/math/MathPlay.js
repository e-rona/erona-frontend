import React, {useEffect, useState, useCallback} from 'react';
import {SafeAreaView, View, Text, StyleSheet} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import Tts from 'react-native-tts';
import RNVoice from '@react-native-voice/voice';
import {useNavigation} from '@react-navigation/native';
import Sound from 'react-native-sound';

import {MicroPhone} from '../../components';
import {getGame, queryKeys} from '../../api';
import * as colors from '../../themes';

const QUIZ_TIMER = 3;

export const MathPlay = () => {
  const [isRecord, setIsRecord] = useState(false); // 마이크 켜져 있는지
  const [quizList, setQuizList] = useState([]); // 퀴즈 목록
  const [quizIndex, setQuizIndex] = useState(0); // 현재 퀴즈 인덱스
  const [userAnswer, setUserAnswer] = useState('');
  const [timer, setTimer] = useState(); //타이머
  const [count, setCount] = useState(QUIZ_TIMER); //QUIZ_TIMER초 카운트
  const [finish, setFinish] = useState(''); //인식 끝
  const [answerNum, setAnswerNum] = useState(0);
  const navigation = useNavigation();
  let sound;

  useQuery(queryKeys.game, getGame, {
    onSuccess: data => {
      // setQuizList([
      //   {quiz: '어쩌구', answer: '저쩌고'},
      //   {quiz: '어쩌구', answer: '저쩌고'},
      //   {quiz: '어쩌구', answer: '저쩌고'},
      // ]);
      // readQuiz('어쩌고');
      setQuizList(data.gameList.slice(0, 3));
      readQuiz(data.gameList[0].quiz);
    },
  });

  const playAlarm = useCallback(() => {
    sound = new Sound('sine.mp3', Sound.MAIN_BUNDLE, err => {
      if (err) {
        console.log('err occured');
        console.log(err);
        return;
      }
      sound.play(success => {
        if (success) {
          sound.release();
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
    });
  }, []);

  useEffect(() => {
    RNVoice.onSpeechStart = _onSpeechStart;
    RNVoice.onSpeechEnd = _onSpeechEnd;
    RNVoice.onSpeechError = _onSpeechError;
    RNVoice.onSpeechRecognized = _onSpeechRecognized;
    RNVoice.onSpeechResults = _onSpeechResults;
    RNVoice.onSpeechPartialResults = _onSpeechPartialResults;

    Tts.addEventListener('tts-finish', () => {
      setTimeout(() => {
        setUserAnswer('');

        setIsRecord(true);
        recordVoice();
      }, 300);
    });

    Sound.setCategory('Playback', true);

    return () => {
      if (sound) {
        sound.release();
      }
      Tts.removeEventListener('tts-finish');
      RNVoice.destroy().then(RNVoice.removeAllListeners);
    };
  }, []);

  useEffect(() => {
    if (quizList.length > 0) {
      RNVoice.onSpeechResults = _onSpeechResults;
    }
  }, [quizList, quizIndex]);

  //QUIZ_TIMER초->0초되면 타이머 중지&인식 끝
  useEffect(() => {
    if (count === 0) {
      clearInterval(timer);
      testAnswer();
      setFinish(true);
      stopRecognizing();
    }
  }, [count, timer]);

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

  const testAnswer = () => {
    const trimmedUserAnswer = userAnswer.replace(' ', '');
    const trimmedQuizAnswer = quizList[quizIndex].answer.replace(' ', '');

    const prevAnswerNum = answerNum;
    let curAnswer = false;
    if (trimmedUserAnswer == trimmedQuizAnswer) {
      console.log('맞았습니다');
      setAnswerNum(answerNum => answerNum + 1);
      curAnswer = true;
    }

    const curAnswerNum = curAnswer == true ? prevAnswerNum + 1 : prevAnswerNum;
    // 연속해서 두 개 틀린 경우
    if (quizIndex == 1 && curAnswerNum == 0) {
      playAlarm();
      navigation.navigate('CurrentPosition');
      return;
    }
    if (quizIndex == 2) {
      if (curAnswerNum == 3) {
        navigation.navigate('Success', {
          perfect: true,
        });
        return;
      }
      if (curAnswerNum == 2) {
        navigation.navigate('Success', {
          perfect: false,
        });
        return;
      } else {
        playAlarm();
        navigation.navigate('CurrentPosition');
        return;
      }
    }
    if (quizIndex < 2) {
      readQuiz(quizList[quizIndex + 1].quiz);
      setQuizIndex(quizIndex => quizIndex + 1);
      setIsRecord(false);
      setCount(QUIZ_TIMER);
    }
  };

  const _onSpeechStart = () => {
    console.log('onSpeechStart');
    //QUIZ_TIMER초 시작
    setFinish(false);
    setTimer(
      setInterval(() => {
        if (count >= 0) {
          setCount(c => c - 1);
        }
      }, 1000),
    );
  };

  const _onSpeechEnd = () => {
    console.log('onSpeechEnd');
    setIsRecord(false);
  };

  const stopRecognizing = async () => {
    try {
      await RNVoice.stop();
      setIsRecord(false);
      setUserAnswer('');
    } catch (e) {
      console.error(e);
    }
  };

  const _onSpeechResults = event => {
    const userSpoken = event.value[0];
    setUserAnswer(userSpoken);
  };
  const _onSpeechError = e => {
    //console.log('onSpeechError: ', e);
  };

  const _onSpeechRecognized = e => {
    //console.log('onSpeechRecognized: ', e);
  };

  const _onSpeechPartialResults = e => {
    // console.log('onSpeechPartialResults: ', e);
  };

  const recordVoice = async () => {
    console.log('인식 시작');
    try {
      await RNVoice.start('ko-KR', {
        RECOGNIZER_ENGINE: 'GOOGLE',
        EXTRA_PARTIAL_RESULTS: true,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={styled.container}>
      <View style={styled.quizTextContainer}>
        {/* 카운트, 인식결과 출력 */}
        <View style={styled.textContainer}>
          <Text style={styled.quizText}>{isRecord ? userAnswer : quizList.length > 0 && quizList[quizIndex].quiz}</Text>
        </View>
        <Text style={styled.timer}>{count}</Text>
      </View>
      <View style={styled.micContainer}>{<MicroPhone isTalking={isRecord} onPress={onPressMic} />}</View>
    </SafeAreaView>
  );
};

const styled = StyleSheet.create({
  textContainer: {
    minHeight: 86,
  },
  timer: {
    color: colors.gray700,
    fontFamily: 'Pretendard-SemiBold',
    marginTop: 24,
    fontSize: 36,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  quizTextContainer: {
    flexDirection: 'column',
    marginTop: 200,
    justifyContent: 'center',
    alignItems: 'center',
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
