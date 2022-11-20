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
    navigation.navigate('MovieStackNavigator');
  }, [navigation]);

  const onPressSuccess = useCallback(() => {
    navigation.navigate('Success', {
      perfect: false,
    });
  }, []);

  const onPressCurrentPosition = useCallback(() => {
    navigation.navigate('CurrentPosition');
  }, []);
  return (
    <View style={styled.rootContainer}>
      <ButtonRound label="시작" onPress={onPressCurrentPosition} />
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
