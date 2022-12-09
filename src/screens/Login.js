import React, {useEffect, useCallback} from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {getProfile as getKakaoProfile, login} from '@react-native-seoul/kakao-login';

import * as colors from '../themes/colors';
import kakaoLoginButton from '../assets/icons/kakaoLoginButton.png';
import appleLoginButton from '../assets/icons/appleLoginButton.png';
import googleLoginButton from '../assets/icons/googleLoginButton.png';

export const Login = () => {
  const navigation = useNavigation();

  const signInWithKakao = async () => {
    const token = await login();
    console.log('kakao token : ', token);
    getProfile();
  };

  const getProfile = async () => {
    const profile = await getKakaoProfile();
    console.log(profile.id);
    navigation.navigate('SignUp');
  };

  return (
    <View style={styled.rootContainer}>
      <Text style={styled.title}>ERONA</Text>
      <TouchableOpacity onPress={signInWithKakao}>
        <Image source={kakaoLoginButton} style={styled.button} />
      </TouchableOpacity>
      <Image source={appleLoginButton} style={styled.button} />
      <Image source={googleLoginButton} style={styled.button} />
    </View>
  );
};

const styled = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Pretendard-Black',
    fontSize: 32,
    color: colors.main,
    marginBottom: 120,
  },
  button: {
    width: 300,
    height: 48,
    marginBottom: 16,
  },
});
