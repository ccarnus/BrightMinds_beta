import React, { useEffect } from 'react';
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import * as SplashScreen from 'expo-splash-screen';
import MainNavigator from './components/MainNavigator';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const App = () => {
  let [fontsLoaded] = useFonts({
    'Montserrat': Montserrat_400Regular,
    'MontserratBold': Montserrat_700Bold,
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Wait for fonts to load here
        await fontsLoaded;
      } catch (e) {
        console.warn(e);
      } finally {
        // Hide the splash screen
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return <MainNavigator />;
};

export default App;
