import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import BottomNavigation from './BottomNavigation';
import PostCast from './PostCast/PostCast';
import CastTypeChoice from './PostCast/CastTypeChoice';
import Ready from './Track/ready';
import Evaluation from './Track/evaluation';
import Banner from './Banner';
import ProfileScreen from './ProfileScreen';
import SuggestedForYou from './Cast/SuggestedForYouScreen';

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="BottomNav"
        screenOptions={{
          header: () => <Banner />
        }}
      >
        <Stack.Screen name="BottomNav" component={BottomNavigation} options={{ headerShown: true, tabBarVisible: true}} />
        <Stack.Screen name="Evaluation" component={Evaluation} options={{ headerShown: true, tabBarVisible: true }} />
        <Stack.Screen name="Ready" component={Ready} options={{ headerShown: false, tabBarVisible: true }} />
        <Stack.Screen name="CastTypeChoice" component={CastTypeChoice} options={{ headerShown: true, tabBarVisible: true }} />
        <Stack.Screen name="PostCast" component={PostCast} options={{ headerShown: true, tabBarVisible: true }}/>
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: true, tabBarVisible: true }}/>
        <Stack.Screen name="SuggestedForYou" component={SuggestedForYou} options={{ headerShown: false, tabBarVisible: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;