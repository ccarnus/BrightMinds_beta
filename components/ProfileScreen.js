import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProfileScreen = () => {
  return (
    <View>
      <Text>Profile Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1', // Background color
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1c1c1c', // Text color
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    color: '#1c1c1c', // Text color
  },
});

export default ProfileScreen;
