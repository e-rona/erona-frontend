import React, {useEffect, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ButtonSmall} from '../components';
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
  }, [navigation]);

  return (
    <View style={styled.rootContainer}>
      <ButtonSmall label="졸음 인식" onPress={onPressFaceRecognition} style={{marginBottom: 16}} />
      <ButtonSmall label="사칙 연산" onPress={onPressSpeechRecognition} style={{marginBottom: 16}} />
      <ButtonSmall label="성공 화면" onPress={onPressSuccess} />
      <ButtonSmall label="현재 위치" onPress={CurrentPosition} />
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
