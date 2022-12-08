import React from 'react';
import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {hasNotch} from 'react-native-device-info';
import {ButtonLarge, BadgeButton} from '../components';
import * as style from '../themes/styles';

export const Home = () => {
  const navigation = useNavigation();
  const isNotch = hasNotch();

  const onPressStart = () => {
    navigation.navigate('FaceRecognition');
  };

  const onPressBadgeButton = () => {
    navigation.navigate('Badge');
  };

  return (
    <SafeAreaView style={styled.rootContainer}>
      <View style={style.h1Container}>
        <View style={{marginBottom: 32}}>
          <Text style={style.h1}>진실님, 오늘도</Text>
          <Text style={style.h1}>안전운전 하세요!</Text>
        </View>
        <BadgeButton label="🟡 주의 운전자" onPress={onPressBadgeButton} />
      </View>
      <ButtonLarge label="시작하기" style={{marginBottom: isNotch ? 24 : 48}} onPress={onPressStart} />
    </SafeAreaView>
  );
};

const styled = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
});
