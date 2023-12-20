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
import Trending from './Cast/TrendingScreen';
import SearchResult from './Cast/SearchResultScreen';
import SimpleHeader from './Profile/SimpleHeader';
import LeaderBoard from './LeaderBoardScreen';
import Objective from './Profile/Objective';
import Finish from './Track/finish';

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
        <Stack.Screen name="Finish" component={Finish} options={{ headerShown: false, tabBarVisible: true }} />
        <Stack.Screen name="CastTypeChoice" component={CastTypeChoice} options={{ headerShown: false, tabBarVisible: false }} />
        <Stack.Screen name="PostCast" component={PostCast} options={{ headerShown: false, tabBarVisible: false }}/>
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ header: () => <SimpleHeader /> }}/>
        <Stack.Screen name="SuggestedForYou" component={SuggestedForYou} options={{ headerShown: false, tabBarVisible: false }}/>
        <Stack.Screen name="Trending" component={Trending} options={{ headerShown: false, tabBarVisible: false }}/>
        <Stack.Screen name="SearchResult" component={SearchResult} options={{ headerShown: false, tabBarVisible: false }}/>
        <Stack.Screen name="LeaderBoard" component={LeaderBoard} options={{ header: () => <SimpleHeader /> }}/>
        <Stack.Screen name="Objective" component={Objective} options={{ header: () => <SimpleHeader /> }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;