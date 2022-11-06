import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {KakaoMapView} from '@jiggag/react-native-kakao-maps';

export const CurrentPosition = () => {
  const [location, setLocation] = useState(undefined);
  const [rest, setRest] = useState();
  const [sleep, setSleep] = useState();

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
    }
  }, [rest, sleep]);

  return (
    <KakaoMapView
      // markerImageName="customImageName" // 옵션1
      // markerImageUrl="https://github.com/jiggag/react-native-kakao-maps/blob/develop/example/custom_image.png?raw=true" // 옵션2
      markerList={[
        {
          lat: 37.59523,
          lng: 127.086,
          markerName: 'marker',
        },
        {
          lat: 37.59523,
          lng: 127.08705,
          markerName: 'marker2',
        },
      ]}
      width={300}
      height={500}
      centerPoint={{
        lat: 37.59523,
        lng: 127.086,
      }}
    />
  );
};

const styled = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
