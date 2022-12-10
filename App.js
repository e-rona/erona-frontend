import 'react-native-gesture-handler';
import React, {useEffect, useRef, useState} from 'react';
import {AppState, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {setCustomText} from 'react-native-global-props';
import Tts from 'react-native-tts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import {RootStackNavigator} from './src/navigations/RootStackNavigator';
import {LogBox} from 'react-native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import SplashScreen from 'react-native-splash-screen';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

import {gray900} from './src/themes/colors';

const customTextProps = {
  style: {
    fontFamily: 'Pretendard-Regular',
    color: gray900,
  },
};
const queryClient = new QueryClient();

const App = () => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [runningTime, setRunningTime] = useState(0);
  const [token, setToken] = useState('');

  const getToken = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    setToken(token);
  };

  const postTime = async token => {
    try {
      const {data} = await axios.post(
        'http://43.201.76.241:8080/api/command/time/register',
        {
          useTime: '60',
          count: '0',
        },
        {
          headers: {
            accessToken: token,
          },
        },
      );
      console.log('succcess');
      console.log(data);
      setRunningTime(0);
    } catch (err) {}
  };

  useEffect(() => {
    getToken();

    try {
      SplashScreen.hide();
    } catch (e) {
      console.warn('스플래시 스크린 닫는데 에러발생');
      console.warn(e);
    }
    setCustomText(customTextProps);

    const subscription = AppState.addEventListener('change', nextAppState => {
      // if (nextAppState == 'inactive' || nextAppState == 'background') {
      //   console.log(runningTime);
      //   //postTime();
      // }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    Tts.getInitStatus().then(
      () => {},
      err => {
        if (err.code === 'no_engine') {
          console.log('here');
          Tts.requestInstallEngine();
        }
      },
    );

    Tts.setDefaultLanguage('ko-KR');
    Tts.setIgnoreSilentSwitch('ignore');

    Platform.OS == 'android' && Tts.setDefaultRate(0.4);

    const interval = setInterval(() => {
      appStateVisible == 'active' && setRunningTime(runningTime => runningTime + 1);
    }, 1000);

    const interval2 = setInterval(async () => {
      const token = await AsyncStorage.getItem('accessToken');
      postTime(token);
    }, 60000);

    return () => {
      clearInterval(interval);
      clearInterval(interval2);

      subscription.remove();
    };
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider style={{flex: 1, backgroundColor: 'white'}}>
        <NavigationContainer>
          <RootStackNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
};

export default App;
