import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, View, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {hasNotch} from 'react-native-device-info';

import {ButtonLarge} from '../components/ButtonLarge';
import * as colors from '../themes/colors';

const isNotch = hasNotch();

export const Success = () => {
  // const [seconds, setSeconds] = useState(5);

  // useEffect(() => {
  //   const countdown = setInterval(() => {
  //     if (parseInt(seconds) > 0) {
  //       setSeconds(parseInt(seconds) - 1);
  //     }
  //     if (parseInt(seconds) === 0) {
  //       clearInterval(countdown);
  //       exitApp();
  //     }
  //   }, 1000);
  //   return () => clearInterval(countdown);
  // }, [seconds]);
  const navigation = useNavigation();

  const onPressGoMain = useCallback(() => {
    navigation.navigate('Home');
  }, []);

  return (
    <SafeAreaView style={styeld.container}>
      <View style={styeld.textContainer}>
        <Text style={styeld.h1}>졸음 미션 달성 🎉</Text>
        {/* <Text style={styeld.h2}>{seconds}초 후 어플을 종료합니다</Text> */}
      </View>
      <ButtonLarge label="메인으로 이동" style={{marginBottom: isNotch ? 24 : 48}} onPress={onPressGoMain} />
    </SafeAreaView>
  );
};

const styeld = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  textContainer: {
    marginLeft: 40,
    marginTop: 150,
  },
  h1: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 32,
    lineHeight: 40,
    marginBottom: 8,
  },
  h2: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 24,
    lineHeight: 32,
    color: colors.gray700,
  },
});
