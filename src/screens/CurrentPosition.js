import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {KakaoMapView} from '@jiggag/react-native-kakao-maps';

export const CurrentPosition = () => {
  const [location, setLocation] = useState(undefined);

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

  return (
    <View style={styled.container}>
      <Text>현재 위치</Text>
      {location ? (
        <>
          <Text>Latitude: {location.latitude}</Text>
          <Text>Latitude: {location.longitude}</Text>
          <KakaoMapView
            markerImageName="customImageName" // 옵션1
            markerImageUrl="https://github.com/jiggag/react-native-kakao-maps/blob/develop/example/custom_image.png?raw=true" // 옵션2
            markerList={[
              {
                lat: location.latitude,
                lng: location.longitude,
                markerName: 'marker',
              },
            ]}
            width={300}
            height={500}
            centerPoint={{
              lat: location.latitude,
              lng: location.longitude,
            }}
          />
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styled = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
