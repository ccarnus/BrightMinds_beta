import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';

const ObjectiveScreen = () => {
  const buttons = ['Follower', 'Explorer', 'Deep Learner', 'Researcher', 'Career'];
  const route = useRoute();
  const objective = route.params?.objective;

  const handleIconPress = (buttonName) => {
    Alert.alert(`Button Name`, `${buttonName}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Learning Pathway</Text>
      {buttons.map((buttonName) => (
        <View key={buttonName} style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, objective === buttonName && styles.highlightedButton]}
            onPress={() => console.log(`${buttonName} button pressed`)}
          >
            <Text style={styles.buttonText}>{buttonName}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconContainer}
            onPress={() => handleIconPress(buttonName)}
          >
            <Image
              source={require('../../assets/Profile_icons/info_icon.png')}
              style={styles.infoIcon}
            />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  highlightedButton: {
    backgroundColor: '#28a745', // Different background color for the highlighted button
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  iconContainer: {
    padding: 10,
  },
  infoIcon: {
    width: 30,
    height: 30,
  },
});

export default ObjectiveScreen;
