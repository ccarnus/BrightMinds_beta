import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

const LeaderBoardScreen = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    // Fetch leaderboard data from the API
    fetch('http://3.17.219.54/user/leaderboard/by/score')
      .then((response) => response.json())
      .then((data) => setLeaderboardData(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {leaderboardData.map((user, index) => (
        <View key={index} style={styles.userContainer}>
          <Image source={{ uri: user.profilePictureUrl }} style={styles.profilePicture} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.username}</Text>
            <Text style={styles.userRole}>{user.role}</Text>
          </View>
          <Text style={styles.userScore}>{user.score}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#f1f1f1',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 3,
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1c1c1c',
  },
  userRole: {
    fontSize: 14,
    color: '#1c1c1c',
  },
  userScore: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3498db',
  },
});

export default LeaderBoardScreen;
