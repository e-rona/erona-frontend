import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {setCustomText} from 'react-native-global-props';
import {RootStackNavigator} from './src/navigations/RootStackNavigator';

import {gray800} from './src/themes/colors';

const customTextProps = {
  style: {
    fontFamily: 'Pretendard-Regular',
    color: gray800,
  },
};

const App = () => {
  useEffect(() => {
    // set default font
    setCustomText(customTextProps);
  }, []);

  return (
    <SafeAreaProvider style={{flex: 1, backgroundColor: 'white'}}>
      <NavigationContainer>
        <RootStackNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
