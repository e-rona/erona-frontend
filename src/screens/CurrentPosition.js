import React, {useEffect, useState, useCallback} from 'react';
import {View, StyleSheet, Text, Platform, SafeAreaView, DevSettings, ActivityIndicator} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
// import {KakaoMapView} from '@jiggag/react-native-kakao-maps';
import {ButtonLarge} from '../components/ButtonLarge';
import {hasNotch} from 'react-native-device-info';
import {useNavigation} from '@react-navigation/native';

import * as colors from '../themes/colors';

export const CurrentPosition = () => {
  const isNotch = hasNotch();
  const navigation = useNavigation();
  const [location, setLocation] = useState(undefined);
  const [rest, setRest] = useState();
  const [sleep, setSleep] = useState();
  const [destination, setDestination] = useState();

  useEffect(() => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('always');
    }

    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLocation({
          latitude,
          longitude,
        });
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, []);

  useEffect(() => {
    if (!location) return;
    const findRest = async () => {
      try {
        const response = await fetch(
          `https://dapi.kakao.com/v2/local/search/keyword.json?y=${location.latitude}&x=${location.longitude}&radius=20000&query='휴게소'&sort=distance`,
          {
            method: 'GET',
            headers: {Authorization: 'KakaoAK 57fb554e275e7864927c3a28297a522c'},
          },
        );
        if (response.status === 200) {
          const result = await response.json();
          const restArea = result.documents.filter(item => {
            if (item.category_name === '교통,수송 > 휴게소') {
              return true;
            }
          });
          // console.log('휴게소 : ', restArea);
          setRest(restArea[0]);
        } else {
          return false;
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    };

    const findSleep = async () => {
      try {
        const response = await fetch(
          `https://dapi.kakao.com/v2/local/search/keyword.json?y=${location.latitude}&x=${location.longitude}&radius=20000&query='졸음쉼터'&sort=distance`,
          {
            method: 'GET',
            headers: {Authorization: 'KakaoAK 57fb554e275e7864927c3a28297a522c'},
          },
        );
        if (response.status === 200) {
          const result = await response.json();
          const restArea = result.documents.filter(item => {
            if (item.category_name === '교통,수송 > 휴게소 > 졸음쉼터') {
              return true;
            }
          });
          //console.log('졸음쉼터 : ', restArea);
          setSleep(restArea[0]);
        } else {
          return false;
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    };

    findRest();
    findSleep();
  }, [location]);

  useEffect(() => {
    if (rest && sleep) {
      console.log(rest, sleep);
      if (parseInt(rest.distance) <= parseInt(sleep.distance)) {
        setDestination(rest);
      } else {
        setDestination(sleep);
      }
    }
  }, [rest, sleep]);

  const onPressGoMain = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);

  return (
    <SafeAreaView style={styled.container}>
      {!destination ? (
        <View style={styled.loaderContainer}>
          <ActivityIndicator />
        </View>
      ) : (
        <>
          <View style={styled.textContainer}>
            <Text style={styled.h1}>
              전방 {destination.distance >= 1000 ? (destination.distance / 1000).toFixed(1) + 'km' : destination.distance + 'm'} 앞에
              {'\n'}
              {destination.category_name === '교통,수송 > 휴게소' ? '휴게소' : '졸음쉼터'}가 있습니다.
            </Text>
            <Text style={{...styled.h3, marginTop: 24}}>조금 쉬었다 가는 건 어떨까요?☺️</Text>
            {/* <Text style={styled.h2}>{seconds}초 후 어플을 종료합니다</Text> */}
          </View>
          <ButtonLarge label="메인으로 이동" style={{marginBottom: isNotch ? 24 : 48}} onPress={onPressGoMain} />
        </>
      )}
    </SafeAreaView>
  );
};

const styled = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  h3: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 20,
    lineHeight: 28,
    color: colors.gray700,
  },
});
