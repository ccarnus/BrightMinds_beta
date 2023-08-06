import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';

const iconMapping = {
  Cast: {
    unselected: require('../assets/Bottom_icons/cast.png'),
    selected: require('../assets/Bottom_icons/cast.png'),
  },
  Track: {
    unselected: require('../assets/Bottom_icons/track.png'),
    selected: require('../assets/Bottom_icons/track.png'),
  },
  Library: {
    unselected: require('../assets/Bottom_icons/library.png'),
    selected: require('../assets/Bottom_icons/library.png'),
  },
  Leaderboard: {
    unselected: require('../assets/Bottom_icons/leaderboard.png'),
    selected: require('../assets/Bottom_icons/leaderboard.png'),
  },
  // Add more routes and their respective icon paths here
};

const BottomNavigation = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.bottomNav}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const icon = iconMapping[route.name];
        const iconSource = isFocused ? icon.selected : icon.unselected;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={[
              styles.tabButton,
              {
                backgroundColor: isFocused ? '#829aab' : '#f1f1f1',
                borderTopWidth: isFocused ? 2 : 0,
                borderColor: '#829aab',
              },
            ]}
          >
            <Image source={iconSource} style={styles.icon} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f1f1f1', // Background color
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 5,
    backgroundColor: '#f1f1f1', // Button background color
  },
  icon: {
    width: 28,
    height: 28,
    tintColor: '#1c1c1c', // Icon color
  },
});

export default BottomNavigation;
