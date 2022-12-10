import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {hasNotch} from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {ButtonLarge, BadgeButton} from '../components';
import * as style from '../themes/styles';

export const Home = () => {
  const [token, setToken] = useState('');
  const [name, setName] = useState('');
  const [driveInfo, setDriveInfo] = useState({
    useTime: 0,
    count: 0,
    badge: '',
    hh: 0,
    mm: 0,
  });
  const navigation = useNavigation();
  const isNotch = hasNotch();

  const getInfo = async () => {
    const name = await AsyncStorage.getItem('name');
    setName(name);
    const token = await AsyncStorage.getItem('accessToken');
    //const token = await AsyncStorage.getItem('refreshToken')
    try {
      const {data} = await axios.get('http://43.201.76.241:8080/api/query/time/history', {
        headers: {
          accessToken: `${token}`,
        },
      });
      //const useTime = 7200;
      //const count = 1;
      const useTime = parseInt(data.useTime);
      const count = parseInt(data.count);
      const mm = parseInt(useTime / 60);
      const hh = parseInt(mm / 60);
      // 10시간 이상 사용
      if (useTime > 36000) {
      } else {
        setDriveInfo({useTime, count, hh, mm, badge: count === 0 ? '🟢 도로의 수호자' : count === 1 ? '🟠 경고 운전자' : '🔴 위험 운전자'});
      }
    } catch (err) {
      console.log('err:', err);
    }

    setToken(token);
  };
  useEffect(() => {
    getInfo();
  }, []);

  const onPressStart = () => {
    navigation.navigate('MovieStackNavigator');
  };

  const onPressBadgeButton = () => {
    navigation.navigate('Badge', {driveInfo});
  };

  return (
    <SafeAreaView style={styled.rootContainer}>
      <View style={style.h1Container}>
        <View style={{marginBottom: 32}}>
          <Text style={style.h1}>{name}님, 오늘도</Text>
          <Text style={style.h1}>안전운전 하세요!</Text>
        </View>
        <BadgeButton label={driveInfo.badge} onPress={onPressBadgeButton} />
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
