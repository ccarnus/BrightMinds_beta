import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { colors, sizes } from '../theme';
import { Shape } from 'react-native-svg';

const USER_ID = "6474e4001eec5ee1ecd40180";

const ReadyScreen = ({ navigation }) => {
  const [showButton, setShowButton] = useState(false);
  const [numQuestions, setNumQuestions] = useState(0);
  const opacityValue = new Animated.Value(0);
  let castIds;

  const getCastList = async () => {
    try {
      const response = await axios.get('http://3.17.219.54/user/' + USER_ID);
      const evaluationList = response.data.evaluation_list.filter(item => item.watched && !item.answered);
      castIds = evaluationList.map(item => item.castid);
      setNumQuestions(castIds.length);
    } catch (error) {
      console.error('Error fetching evaluation list:', error);
    }
  };
  
  getCastList();

  useEffect(() => {
    setShowButton(true);
    Animated.timing(opacityValue, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  });

  const handleReadyButtonPress = () => {
    if (numQuestions > 0) {
      navigation.navigate('Evaluation', { castIds });
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>You have</Text>
      <Text style={styles.numQuestions}>{numQuestions}</Text>
      <Text style={styles.title}>{numQuestions === 1 ? 'Question' : 'Questions'}</Text>
      <View style={styles.buttonContainer}>
        <Animated.View style={[styles.readyButton, { opacity: opacityValue }]}>
          <TouchableOpacity onPress={handleReadyButtonPress}>
          <Text style={styles.readyButtonText}>
              {numQuestions > 0 ? "Let's GO!" : "Come Back Later"} 
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkblue,
    paddingTop: 200,
    alignItems: 'center',
  },
  title: {
    fontSize: sizes.title,
    color: colors.white,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  numQuestions: {
    fontSize: 48,
    color: colors.white,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  questionsText: {
    fontSize: 20,
    color: colors.white,
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
    marginBottom: 80,
  },
  readyButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderColor: colors.white,
    borderRadius: sizes.radius,
    borderWidth: 2,
  },
  readyButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.white,
  },
});

export default ReadyScreen;
