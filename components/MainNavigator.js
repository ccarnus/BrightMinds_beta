import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import BottomNavigation from './BottomNavigation';
import CatchUpScreen from './Cast/CatchUpScreen';
import PostCast from './PostCast/PostCast';
import CastTypeChoice from './PostCast/CastTypeChoice';
import Ready from './Track/ready';
import Evaluation from './Track/evaluation';
import Track from './TrackScreen';
import CategoryPickerScreen from './Cast/CategoryPickerScreen';

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Root"
          component={BottomNavigation}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="CategoryPickerScreen" component={CategoryPickerScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Track" component={Track} options={{ headerShown: false }} />
        <Stack.Screen name="Evaluation" component={Evaluation} options={{ headerShown: false }} />
        <Stack.Screen name="Ready" component={Ready} options={{ headerShown: false }} />
        <Stack.Screen name="CastTypeChoice" component={CastTypeChoice} options={{ headerShown: false }} />
        <Stack.Screen name="CatchUpScreen" component={CatchUpScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="PostCast" component={PostCast} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;