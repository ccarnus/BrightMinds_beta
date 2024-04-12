import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, sizes, spacing } from './theme';

const Banner = () => {
  const navigation = useNavigation();
  const defaultProfileIcon = require('../assets/Banner_icons/profile.png');
  const [profileImageSource, setProfileImageSource] = useState({ source: defaultProfileIcon });
  const userId = "6474e4001eec5ee1ecd40180";

  const handleProfilePress = () => {
    navigation.navigate('ProfileScreen');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://3.17.219.54/user/${userId}`);
        const data = await response.json();

        if (data && data.profilePictureUrl) {
          setProfileImageSource({ source: { uri: data.profilePictureUrl } });
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.bannerContainer}>
      <TouchableOpacity onPress={handleProfilePress} style={styles.logoContainer}>
        <Image
          source={require('../assets/Banner_icons/logo_polar_bear.png')}
          style={styles.logoImage}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleProfilePress} >
        <Image
          source={profileImageSource.source}
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
    paddingTop: 30,
    backgroundColor: colors.darkblue,
  },
  logoContainer: {
    flex:1,
    paddingLeft:5,
  },
  logoImage: {
    width:48,
    height:48,
  },
  profileContainer: {
    padding: 10,
  },
  profileImage: {
    width: 42,
    height: 42,
  },
});

export default Banner;
