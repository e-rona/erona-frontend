import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {Platform} from 'react-native';
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
  useEffect(() => {
    try {
      SplashScreen.hide();
    } catch (e) {
      console.warn('에러발생');
      console.warn(e);
    }

    // set default font
    setCustomText(customTextProps);

    // react-native-tts settings
    // install tts engine if not installed
    Tts.getInitStatus().then(
      () => {},
      err => {
        if (err.code === 'no_engine') {
          console.log('here');
          Tts.requestInstallEngine();
        }
      },
    );
    // set default language
    Tts.setDefaultLanguage('ko-KR');

    // set default voice
    //rTts.setDefaultVoice('com.apple.ttsbundle.Yuna-compact');

    // play audio even the silent switch is set
    Tts.setIgnoreSilentSwitch('ignore');

    Platform.OS == 'android' && Tts.setDefaultRate(0.4);
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
