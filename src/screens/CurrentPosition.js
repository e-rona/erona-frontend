import React, {useEffect, useState, useCallback} from 'react';
import {View, StyleSheet, Text, Platform, SafeAreaView, DevSettings, ActivityIndicator} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
// import {KakaoMapView} from '@jiggag/react-native-kakao-maps';
import {ButtonLarge} from '../components/ButtonLarge';
import {hasNotch} from 'react-native-device-info';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import Tts from 'react-native-tts';
import {KAKAO_APP_KEY} from '@env';
import * as colors from '../themes/colors';

export const CurrentPosition = () => {
  const isNotch = hasNotch();
  const navigation = useNavigation();
  const [location, setLocation] = useState(undefined);
  const [rest, setRest] = useState();
  const [sleep, setSleep] = useState();
  const [mart, setMart] = useState();
  const [destination, setDestination] = useState({
    name: '',
    type: '',
    distance: 0,
  });

  const findRest = async () => {
    try {
      const {data, status} = await axios.get(
        `https://dapi.kakao.com/v2/local/search/keyword.json?y=${location.latitude}&x=${location.longitude}&radius=20000&query='휴게소'&sort=distance`,
        {
          headers: {Authorization: 'KakaoAK ' + KAKAO_APP_KEY},
        },
      );
      if (status === 200) {
        const restArea = data.documents.filter(item => item.category_name === '교통,수송 > 휴게소');
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
      const {status, data} = await axios.get(
        `https://dapi.kakao.com/v2/local/search/keyword.json?y=${location.latitude}&x=${location.longitude}&radius=20000&query='졸음쉼터'&sort=distance`,
        {
          method: 'GET',
          headers: {Authorization: 'KakaoAK ' + KAKAO_APP_KEY},
        },
      );
      if (status === 200) {
        const restArea = data.documents.filter(item => item.category_name === '교통,수송 > 휴게소 > 졸음쉼터');
        setSleep(restArea[0]);
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const findMart = async () => {
    try {
      const {status, data} = await axios.get(
        `https://dapi.kakao.com/v2/local/search/keyword.json?y=${location.latitude}&x=${location.longitude}&radius=3000&query='편의점'&sort=distance`,
        {
          method: 'GET',
          headers: {Authorization: 'KakaoAK ' + KAKAO_APP_KEY},
        },
      );

      if (status === 200) {
        const martArea = data.documents.filter(item => item.category_group_name === '편의점');
        setMart(martArea[0]);
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  useEffect(() => {
    Tts.setIgnoreSilentSwitch('ignore');
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

    findRest();
    findSleep();
    findMart();
  }, [location]);

  const readResult = sentence => {
    Tts.speak(sentence, {
      rate: 0.4,
    });
  };

  useEffect(() => {
    if (rest && sleep && mart) {
      const {place_name: restName, distance: restDistance} = rest;
      const {place_name: sleepName, distance: sleepDistance} = sleep;
      const {place_name: martName, distance: martDistance} = mart;

      let sentence = '';

      // 휴게소와 졸음 쉼터 둘 다 너무 먼 경우
      if (parseInt(restDistance) > 5000 && parseInt(sleepDistance) > 5000) {
        setDestination({
          name: martName,
          type: '편의점이',
          distance: martDistance,
        });
        distance = sentence = `전방 ${martDistance >= 1000 ? (martDistance / 1000).toFixed(1) + 'km' : martDistance + 'm'} 앞에 편의점이 있습니다.`;
      } else {
        // 휴게소가 더 가까운 경우
        if (parseInt(restDistance) <= parseInt(sleepDistance)) {
          setDestination({
            name: restName,
            type: '휴게소가',
            distance: restDistance,
          });

          sentence = `전방 ${restDistance >= 1000 ? (restDistance / 1000).toFixed(1) + 'km' : restDistance + 'm'} 앞에 졸음쉼터가 있습니다.`;
        }
        // 졸음쉼터가 더 가까운 경우
        else {
          setDestination({
            name: sleepName,
            type: '졸음 쉼터가',
            distance: sleepDistance,
          });

          sentence = `전방 ${sleepDistance >= 1000 ? (sleepDistance / 1000).toFixed(1) + 'km' : sleepDistance + 'm'} 앞에 휴게소가 있습니다.`;
        }
      }
      readResult(sentence);
    }
  }, [rest, sleep, mart]);

  const onPressGoMain = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styled.container}>
      {destination.name == '' ? (
        <View style={styled.loaderContainer}>
          <ActivityIndicator />
        </View>
      ) : (
        <>
          <View style={styled.textContainer}>
            <Text style={styled.h1}>
              전방 {destination.distance >= 1000 ? (destination.distance / 1000).toFixed(1) + 'km' : destination.distance + 'm'} 앞에
              {'\n'}
              {destination.type} 있습니다.
            </Text>
            <Text style={{...styled.h3, marginTop: 24}}>조금 쉬었다 가는 건 어떨까요? ☺️</Text>
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
