import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const Banner = ({ onProfilePress }) => {
  return (
    <View style={styles.bannerContainer}>
      <View style={styles.appNameContainer}>
        <Text style={styles.appName}>BrightMinds</Text>
      </View>
      <TouchableOpacity onPress={onProfilePress} style={styles.profileContainer}>
      <Image
          source={require('../assets/Bottom_icons/profile.png')} // Replace with the actual path to the profile image
          style={styles.profileImage}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#f1f1f1', // Background color,
    marginTop: 10, // Add margin to the top
  },
  appNameContainer: {
    flex: 1,
    marginRight: 10,
  },
  appName: {
    fontSize: 24,
    color: '#1c1c1c', // Text color
    fontWeight: 'bold',
  },
  profileContainer: {
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
  },
  profileImage: {
    width: 24,
    height: 24,
    tintColor: '#1c1c1c', // Icon color
  },
  profileText: {
    color: '#1c1c1c', // Text color
    fontWeight: 'bold',
  },
});


export default Banner;
