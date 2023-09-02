import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CastScreen from './CastScreen';
import TrackScreen from './TrackScreen';
import LibraryScreen from './LibraryScreen';
import LeaderBoardScreen from './LeaderBoardScreen';
import {colors, sizes} from './theme';
import {StyleSheet, Animated} from 'react-native';
import Icon from '../assets/Bottom_icons/Icon';

const tabs = [
  {
    name: 'Cast',
    screen: CastScreen,
  },
  {
    name: 'Track',
    screen: TrackScreen,
  },
  {
    name: 'Library',
    screen: LibraryScreen,
  },
  {
    name: 'LeaderBoard',
    screen: LeaderBoardScreen,
  },
];

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
  const offsetAnimation = React.useRef(new Animated.Value(0)).current;
  return (
    <>
      <Tab.Navigator
        initialRouteName="Cast"
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
        }}>
        {tabs.map(({name, screen}, index) => {
          return (
            <Tab.Screen
              key={name}
              name={name}
              component={screen}
              options={{
                tabBarIcon: ({focused}) => {
                  return (
                    <Icon
                      icon={name}
                      size={32}
                      style={{
                        tintColor: focused ? colors.primary : colors.gray,
                      }}
                    />
                  );
                },
              }}
              listeners={{
                focus: () => {
                  Animated.spring(offsetAnimation, {
                    toValue: index * (sizes.width / tabs.length),
                    useNativeDriver: true,
                  }).start();
                },
              }}
            />
          );
        })}
      </Tab.Navigator>
      <Animated.View
        style={[
          styles.indicator,
          {
            transform: [
              {
                translateX: offsetAnimation,
              },
            ],
          },
        ]}
      />
    </>
  );
};

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    width: 24,
    height: 2,
    left: sizes.width / tabs.length / 2 - 12,
    bottom: 40,
    backgroundColor: colors.primary,
    zIndex: 100,
  },
});

export default BottomNavigation;