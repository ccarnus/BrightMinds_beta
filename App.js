import React from 'react';
import { useFonts, Montserrat_400Regular } from '@expo-google-fonts/montserrat';
import AppLoading from 'expo-app-loading';
import MainNavigator from './components/MainNavigator';

const App = () => {
  let [fontsLoaded] = useFonts({
    Montserrat: Montserrat_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return <MainNavigator />;
};

export default App;
