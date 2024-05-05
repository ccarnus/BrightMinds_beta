import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import BottomNavigation from './BottomNavigation';
import PostCast from './PostContent/PostCast';
import PostArticle from './PostContent/PostArticle';
import CastTypeChoice from './PostContent/CastTypeChoice';
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
import VirtualLab from './VirtualLab/VirtualLab';
import ArticleDetailsScreen from './Cast/ArticleDetailsScreen';

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
        <Stack.Screen name="PostArticle" component={PostArticle} options={{ headerShown: false, tabBarVisible: false }}/>
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false, tabBarVisible: false }}/>
        <Stack.Screen name="SuggestedForYou" component={SuggestedForYou} options={{ headerShown: false, tabBarVisible: false }}/>
        <Stack.Screen name="Trending" component={Trending} options={{ headerShown: false, tabBarVisible: false }}/>
        <Stack.Screen name="SearchResult" component={SearchResult} options={{ headerShown: false, tabBarVisible: false }}/>
        <Stack.Screen name="LeaderBoard" component={LeaderBoard} options={{ headerShown: false, tabBarVisible: false }}/>
        <Stack.Screen name="Objective" component={Objective} options={{ headerShown: false, tabBarVisible: false }}/>
        <Stack.Screen name="VirtualLab" component={VirtualLab} options={{ headerShown: false, tabBarVisible: false }}/>
        <Stack.Screen name="ArticleDetails" component={ArticleDetailsScreen} options={{ headerShown: false, tabBarVisible: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;