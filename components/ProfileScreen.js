import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import { colors, shadow, sizes, spacing } from './theme';

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Make a GET request to fetch user data
    axios
      .get('http://3.17.219.54/user/6474e4001eec5ee1ecd40180')
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  return (
    <View style={styles.container}>
      {userData && (
        <View>
          <Image
            source={{ uri: userData.profilePictureUrl }}
            style={styles.profileImage}
          />
          <Text style={styles.username}>{userData.username}</Text>
          <Text style={styles.department}>{userData.department}</Text>
          <Text style={styles.score}>{userData.score} xp ({userData.percentage}%)</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  profileImage: {
    width: 240,
    height: 240,
    borderRadius: 60,
    marginBottom: 10,
  },
  username: {
    fontSize: sizes.title,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 10,
    textAlign: 'center',
  },
  department: {
    fontSize: sizes.h2,
    color: colors.black,
    marginBottom: 10,
    textAlign: 'center',
  },
  score: {
    fontSize: sizes.h3,
    color: colors.black,
    marginBottom: 5,
    textAlign: 'center',
  },
});

export default ProfileScreen;
