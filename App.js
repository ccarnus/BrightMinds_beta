import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Banner from './components/Banner';
import BottomNavigation from './components/BottomNavigation';
import CastScreen from './components/CastScreen';
import TrackScreen from './components/TrackScreen';
import LibraryScreen from './components/LibraryScreen';
import LeaderBoardScreen from './components/LeaderBoardScreen';
import ProfileScreen from './components/ProfileScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Banner />
      <Tab.Navigator tabBar={(props) => <BottomNavigation {...props} />}>
        <Tab.Screen name="Cast" component={CastScreen} options={{ headerShown: false }}/>
        <Tab.Screen name="Track" component={TrackScreen} options={{ headerShown: false }}/>
        <Tab.Screen name="Library" component={LibraryScreen} options={{ headerShown: false }}/>
        <Tab.Screen name="Leaderboard" component={LeaderBoardScreen} options={{ headerShown: false }}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
