import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Alert } from 'react-native';
import axios from 'axios';
import Slider from '@react-native-community/slider';
import { colors, shadow, sizes, spacing } from './theme';

const { width, height } = Dimensions.get('window');

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const [userPreferences, setUserPreferences] = useState([]);
  const streak = 5;

  useEffect(() => {
    // Fetch user data
    axios
      .get('http://3.17.219.54/user/6474e4001eec5ee1ecd40180')
      .then(response => setUserData(response.data))
      .catch(error => console.error('Error fetching user data:', error));

    // Fetch user preferences
    axios
      .get('http://3.17.219.54/user/6474e4001eec5ee1ecd40180/preferences')
      .then(response => setUserPreferences(response.data.preferences))
      .catch(error => console.error('Error fetching user preferences:', error));
  }, []);

  const handleSliderComplete = (category, newValue) => {
    Alert.alert(`Section ${category} updated to ${newValue.toFixed(2)}`);
  };

  return (
    <View style={styles.container}>
      {userData && (
        <View style={styles.upperSection}>
          <View>
            <Image
              source={{ uri: userData.profilePictureUrl }}
              style={styles.profileImage}
            />
            <Text style={styles.overlayUsername}>{userData.username}</Text>
          </View>
          <View style={styles.scoreContainer}>
          <View style={styles.streakContainer}>
            <Text style={styles.streakText}>{streak}</Text>
            <Image
              source={require('../assets/Profile_icons/streak_02.png')}
              style={styles.streakImage}
            />
          </View>
            <Text style={styles.score}>{userData.score} xp</Text>
          </View>
        </View>
      )}
      <View style={styles.lowerSection}>
        <Text style={styles.preferencesTitle}>Preferences</Text>
        {userPreferences.map(pref => (
          <View key={pref._id} style={styles.preferenceContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.preferenceText}>{pref.category}</Text>
            </View>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                value={pref.weight / 100}
                onSlidingComplete={(newValue) => handleSliderComplete(pref.category, newValue * 100)}
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor={colors.lightblue}
                maximumTrackTintColor={colors.grey}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  upperSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: height / 3,
  },
  lowerSection: {
    flex: 2,
    backgroundColor: colors.darkblue,
    alignItems: 'center',
  },
  profileImage: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  score: {
    fontSize: sizes.h3,
    fontWeight: 'bold',
    color: colors.black,
    marginTop: 10,
  },
  preferenceContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    width: "100%",
  },
  preferenceText: {
    fontSize: sizes.h3,
    color: colors.white,
    textAlign: "center",
  },
  slider: {
    width: "100%",
  },
  sliderContainer: {
    width: "75%",
    marginRight: 5,
  },
  textContainer: {
    width: "25%",
    marginLeft: 5,
    textAlign: "center",
  },
  department: {
    fontSize: sizes.h2,
    color: colors.black,
    marginBottom: 10,
    textAlign: 'center',
  },
  streakContainer: {
    backgroundColor: colors.black,
    borderRadius: sizes.radius,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
  },
  streakText: {
    fontSize: sizes.title,
    color: 'white',
  },
  overlayUsername: {
    position: 'absolute',
    bottom: -15,
    alignSelf: 'center',
    backgroundColor: colors.white,
    color: 'white',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: sizes.radius,
    fontSize: sizes.h3,
    color:colors.black,
    fontWeight: 'bold',
    borderWidth: 1,
  },
  preferencesTitle: {
    fontSize: sizes.title,
    color: colors.white,
    marginBottom: 10,
    marginTop: 10,
  },
  streakImage: {
    width: 42,
    height: 42,
    marginLeft: 5, 
  },
});

export default ProfileScreen;
