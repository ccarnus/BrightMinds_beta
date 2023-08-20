import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const USER_ID = "6474e4001eec5ee1ecd40180";

const ReadyScreen = ({ navigation }) => {
  const [showButton, setShowButton] = useState(false);
  const opacityValue = new Animated.Value(0); 

  const handleTakeTestPress = async () => {
    try {
      const response = await axios.get('http://3.17.219.54/user/' + USER_ID);
      const evaluationList = response.data.evaluation_list.filter(item => item.watched && !item.answered);
      const castIds = evaluationList.map(item => item.castid);
  
      navigation.navigate('TakeTest', { castIds });
    } catch (error) {
      console.error('Error fetching evaluation list:', error);
    }
  };
  

  useEffect(() => {
      setShowButton(true);
      Animated.timing(opacityValue, {
        toValue: 1, // Change this value to control opacity (0 to 1)
        duration: 3000, // Duration of the opacity animation in milliseconds
        useNativeDriver: true,
      }).start();
  });

  const handleReadyButtonPress = () => {
    navigation.navigate('Evaluation');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ready to test yourself?</Text>
      <View style={styles.buttonContainer}>
        <Animated.View style={[styles.readyButton, { opacity: opacityValue }]}>
          <TouchableOpacity onPress={handleTakeTestPress}>
            <Text style={styles.readyButtonText}>Ready!</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 100, // Adjust this value to position the button
    width: '100%',
    alignItems: 'center',
  },
  readyButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },
  readyButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default ReadyScreen;
