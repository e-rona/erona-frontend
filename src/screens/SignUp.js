import React, {useEffect, useCallback, useRef, useState} from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity, TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as colors from '../themes/colors';

export const SignUp = ({navigation: {setOptions}, route: {params}}) => {
  const [name, setName] = useState('');
  const navigation = useNavigation();

  const signUp = async () => {
    console.log(name, params.userId);
    try {
      const {data} = await axios.post('http://43.201.76.241:8080/login/register', {
        userId: params.userId,
      });
      console.log(data);
      await AsyncStorage.setItem('accessToken', data.accessToken);
      await AsyncStorage.setItem('refreshToken', data.refreshToken);
      await AsyncStorage.setItem('name', name);
      console.log(await AsyncStorage.getItem('accessToken'));
      console.log(await AsyncStorage.getItem('refreshToken'));
      console.log(await AsyncStorage.getItem('name'));
      navigation.navigate('Home');
      //home화면으로 이동
    } catch (err) {
      console.log('err:', err);
    }
  };

  return (
    <View style={styled.rootContainer}>
      <Text style={styled.title}>이로나에서 사용할{'\n'}닉네임을 입력해 주세요.</Text>
      <TextInput style={styled.textInput} placeholder="닉네임 입력" onChangeText={value => setName(value)} />
      <TouchableOpacity onPress={signUp}>
        <View style={styled.button}>
          <Text style={styled.buttonText}>가입완료</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styled = StyleSheet.create({
  rootContainer: {
    flex: 1,
    paddingTop: 100,
    alignItems: 'center',
  },
  title: {
    width: 350,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 24,
    color: colors.gray900,
    marginBottom: 20,
    textAlign: 'left',
  },
  textInput: {
    width: 345,
    height: 52,
    borderRadius: 4,
    borderColor: colors.gray300,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  button: {
    marginTop: 30,
    width: 350,
    height: 56,
    backgroundColor: colors.main,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 48,
  },
  buttonText: {
    fontFamily: 'Pretendard-Bold',
    color: colors.white,
    fontSize: 16,
  },
});
