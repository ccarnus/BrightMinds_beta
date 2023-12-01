import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import {colors, shadow, sizes, spacing} from './theme';
import UserSection from './LeaderBoard/UserSection';

const LeaderBoardScreen = () => {
  const [usersLeaderboard, setUsersLeaderboard] = useState([]);
  const [universitiesLeaderboard, setUniversitiesLeaderboard] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Users'); // Default to Users leaderboard

  useEffect(() => {
    // Fetch users leaderboard data
    if (selectedCategory === 'Users') {
      fetch('http://3.17.219.54/user')
        .then((response) => response.json())
        .then((data) => setUsersLeaderboard(data))
        .catch((error) => console.error(error));
    }
    // Fetch universities leaderboard data
    else if (selectedCategory === 'Universities') {
      fetch('http://3.17.219.54/university')
        .then((response) => response.json())
        .then((data) => setUniversitiesLeaderboard(data))
        .catch((error) => console.error(error));
    }
  }, [selectedCategory]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.categoryButtons}>
        <TouchableOpacity
          style={[styles.categoryButton, selectedCategory === 'Users' && styles.selectedCategory]}
          onPress={() => setSelectedCategory('Users')}
        >
          <Text style={[styles.categoryButtonText, selectedCategory === 'Users' && styles.selectedCategoryText]}>Users</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.categoryButton, selectedCategory === 'Universities' && styles.selectedCategory]}
          onPress={() => setSelectedCategory('Universities')}
        >
          <Text style={[styles.categoryButtonText, selectedCategory === 'Universities' && styles.selectedCategoryText]}>Universities</Text>
        </TouchableOpacity>
      </View>

      <UserSection />

      <ScrollView style={styles.scrollContainer}>
      {selectedCategory === 'Users' && (
        usersLeaderboard.map((user, index) => (
          <View key={index} style={styles.entryContainer}>
            <Image source={{ uri: user.profilePictureUrl }} style={styles.profilePicture} />
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{user.username}</Text>
              <Text style={styles.role}>{user.role}</Text>
            </View>
            <Text style={styles.score}>{user.score}</Text>
          </View>
        ))
      )}

      {selectedCategory === 'Universities' && (
        universitiesLeaderboard.map((university, index) => (
          <View key={index} style={styles.entryContainer}>
            <Image source={{ uri: university.iconurl }} style={styles.universityPicture} resizeMode="contain" />
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{university.name}</Text>
            </View>
            <Text style={styles.score}>{university.score}</Text>
          </View>
        ))
      )}
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryButton: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: colors.lightGray,
  },
  categoryButtons: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1,
  },
  scrollContainer: {
    marginTop: 20,
  },
  selectedCategory: {
    borderWidth: 2,
    borderColor: colors.black,
  },
  categoryButtonText: {
    color: colors.black,
    fontWeight: 'bold',
  },
  selectedCategoryText: {
    color: colors.black,
  },
  entryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: colors.light,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    borderRadius: sizes.radius,
    elevation: 3,
  },
  profilePicture: {
    width: 45,
    height: 45,
    borderRadius: 30,
  },
  universityPicture: {
    width: 45,
    height: 45,
    marginLeft:20,
    marginRight:20,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 18,
    color: '#1c1c1c',
  },
  role: {
    fontSize: 14,
    color: '#1c1c1c',
  },
  score: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
    marginRight:20,
  },
});

export default LeaderBoardScreen;
