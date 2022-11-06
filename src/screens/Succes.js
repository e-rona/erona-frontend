import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, View, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {hasNotch} from 'react-native-device-info';

import {ButtonLarge} from '../components/ButtonLarge';
import * as colors from '../themes/colors';

const isNotch = hasNotch();

export const Success = ({route}) => {
  const {perfect} = route.params;
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    const countdown = setInterval(() => {
      if (parseInt(seconds) > 0) {
        setSeconds(parseInt(seconds) - 1);
      }
      if (parseInt(seconds) === 0) {
        clearInterval(countdown);
        onPressGoMain();
      }
    }, 1000);
    return () => clearInterval(countdown);
  }, [seconds]);
  const navigation = useNavigation();

  const onPressGoMain = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styeld.container}>
      <View style={styeld.textContainer}>
        <View style={styeld.h1Container}>
          <Text style={styeld.h2}>{perfect == true ? '전부 맞았어요' : '휴, 아슬아슬 했어요'} </Text>
          <Text style={styeld.h1}>졸음 미션 달성 🎉</Text>
        </View>

        <Text style={styeld.h3}>{seconds}초 후 메인으로 이동합니다</Text>
      </View>
      <ButtonLarge label="메인으로 이동" style={{marginBottom: isNotch ? 24 : 48}} onPress={onPressGoMain} />
    </SafeAreaView>
  );
};

const styeld = StyleSheet.create({
  h1Container: {
    marginBottom: 12,
  },
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
    fontSize: 40,
  },
  h2: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 32,
    marginBottom: 8,
  },
  h3: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 24,
    lineHeight: 32,
    color: colors.gray700,
  },
});
