import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

const USER_ID = "6474e4001eec5ee1ecd40180";

const TakeTest = ({ route, navigation }) => {
  const { castIds } = route.params;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const addPoints = async (points) => {
    try {
      const response = await axios.post(
        'http://3.17.219.54/user/add/points/' + USER_ID,
        {
          Points: points,
        }
      );
      console.log('Points added:', response.data);
    } catch (error) {
      console.error('Error adding points:', error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const questionsPromises = castIds.map(castId =>
        axios.get(`http://3.17.219.54/cast/${castId}`)
      );
      const questionsResponses = await Promise.all(questionsPromises);
      const questionsData = questionsResponses.map(response => response.data.evaluation);

      setQuestions(questionsData);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleAnswerSelection = async (selectedResponse) => {
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.correct;
    const isAnswerCorrect = selectedResponse === correctAnswer;
  
    setSelectedAnswer(selectedResponse);
    setIsCorrect(isAnswerCorrect);
  
    if (isAnswerCorrect) {
      addPoints(10);
    }
  
    // Wait for 1 second and then move to the next question
    setTimeout(() => {
      setSelectedAnswer(null);
      setIsCorrect(null);
  
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        navigation.navigate('TrackScreen');
      }
    }, 1000);
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion?.question}</Text>
      </View>
      <View style={styles.answersContainer}>
        {currentQuestion?.responses.map((response, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.answerButton,
              {
                backgroundColor:
                  selectedAnswer === response
                    ? isCorrect
                      ? 'green'
                      : 'red'
                    : 'transparent',
              },
            ]}
            onPress={() => handleAnswerSelection(response)}
            disabled={selectedAnswer !== null}
          >
            <Text style={styles.answerButtonText}>{response}</Text>
          </TouchableOpacity>
        ))}
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
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  questionText: {
    fontSize: 20,
    textAlign: 'center',
  },
  answersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  answerButton: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  answerButtonText: {
    fontSize: 16,
  },
});

export default TakeTest;
