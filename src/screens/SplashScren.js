import React, {useEffect} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import * as colors from '../themes/colors';
import Logo from '../assets/icons/Erona.png';

export const SplashScreen = () => {
  const navigation = useNavigation();
  const getToken = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');

      if (accessToken) {
        navigation.navigate('Home');
      } else {
        navigation.navigate('Login');
      }
    } catch (err) {
      console.warn('async storage에서 토큰 가져오는 데 에러 발생');
      console.warn(err);
    }
  };
  useEffect(() => {
    getToken();
  }, []);

  return (
    <View style={styled.container}>
      <Image source={Logo} />
    </View>
  );
};

const styled = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 0,
    height: 64,
  },
});
