import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';

const LeaderBoardScreen = () => {
  const [usersLeaderboard, setUsersLeaderboard] = useState([]);
  const [universitiesLeaderboard, setUniversitiesLeaderboard] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Users'); // Default to Users leaderboard

  useEffect(() => {
    // Fetch users leaderboard data
    if (selectedCategory === 'Users') {
      fetch('http://3.17.219.54/user/leaderboard/by/score')
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
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#f1f1f1',
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#1c1c1c',
  },
  categoryButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  scrollContainer: {
    marginTop: 70,
  },
  selectedCategory: {
    borderWidth: 2,
    borderColor: 'red',
  },
  categoryButtonText: {
    color: '#f1f1f1',
    fontWeight: 'bold',
  },
  selectedCategoryText: {
    color: '#f1f1f1',
  },
  entryContainer: {
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
    width: 45,
    height: 45,
    borderRadius: 30,
  },
  universityPicture: {
    width: 45,
    height: 45,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1c1c1c',
  },
  role: {
    fontSize: 14,
    color: '#1c1c1c',
  },
  score: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3498db',
  },
});

export default LeaderBoardScreen;
