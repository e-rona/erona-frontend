import 'react-native-gesture-handler';
import React, {useEffect, useRef, useState} from 'react';
import {AppState, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {setCustomText} from 'react-native-global-props';
import Tts from 'react-native-tts';
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

  useEffect(() => {
    try {
      SplashScreen.hide();
    } catch (e) {
      console.warn('에러발생');
      console.warn(e);
    }
    setCustomText(customTextProps);

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
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

    setInterval(() => {
      appState == 'active' && setRunningTime(runningTime => runningTime + 1);
    }, 1000);
    return () => {
      subscription.remove();
    };
  }, []);

  console.log('runningTime : ', runningTime);

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
