import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Banner from './components/Banner';
import BottomNavigation from './components/BottomNavigation';
import CastScreen from './components/CastScreen';
import CatchUpScreen from './components/Cast/CatchUpScreen';
import TakeTest from './components/Track/evaluation';
import PostCast from './components/PostCast/PostCast';
import TrackScreen from './components/TrackScreen';
import LibraryScreen from './components/LibraryScreen';
import LeaderBoardScreen from './components/LeaderBoardScreen';
import ProfileScreen from './components/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Track = createStackNavigator();

const CastStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="CastScreen" component={CastScreen} options={{ headerShown: false }} />
    <Stack.Screen name="CatchUpScreen" component={CatchUpScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const TrackStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="TrackScreen" component={TrackScreen} options={{ headerShown: false }} />
    <Stack.Screen name="TakeTest" component={TakeTest} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const App = () => {
  return (
    <NavigationContainer>
      <Banner />
      <Tab.Navigator tabBar={(props) => <BottomNavigation {...props} />}>
        <Tab.Screen name="Cast" component={NestedCastStack} options={{ headerShown: false }} />
        <Tab.Screen name="Track" component={TrackStack} options={{ headerShown: false }} />
        <Tab.Screen name="Library" component={LibraryScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Leaderboard" component={LeaderBoardScreen} options={{ headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const NestedCastStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="CastStack" component={CastStack} options={{ headerShown: false }} />
    <Stack.Screen name="PostCast" component={PostCast} options={{ headerShown: false }} />
  </Stack.Navigator>
);

export default App;
