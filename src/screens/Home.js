import React, {useEffect, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ButtonSmall, ButtonRound} from '../components';
import {CurrentPosition} from './CurrentPosition';

export const Home = () => {
  const navigation = useNavigation();
  const onPressFaceRecognition = useCallback(() => {
    navigation.navigate('FaceRecognition');
  }, [navigation]);

  const onPressSpeechRecognition = useCallback(() => {
    navigation.navigate('MathStackNavigator');
  }, [navigation]);

  const onPressSuccess = useCallback(() => {
    navigation.navigate('Success');
  }, []);

  const onPressKakaoMap = useCallback(() => {
    navigation.navigate('KakaoMap');
  }, []);
  return (
    <View style={styled.rootContainer}>
      {/* <ButtonSmall
        label="졸음 인식"
        onPress={onPressFaceRecognition}
        style={{marginBottom: 16}}
      />
      <ButtonSmall
        label="사칙 연산"
        onPress={onPressSpeechRecognition}
        style={{marginBottom: 16}}
      />
      <ButtonSmall label="성공 화면" onPress={onPressSuccess} /> */}
      <ButtonRound label="시작" onPress={onPressSpeechRecognition} />
      {/* <ButtonRound label="카카오맵" onPress={onPressKakaoMap} /> */}
    </View>
  );
};

const styled = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
