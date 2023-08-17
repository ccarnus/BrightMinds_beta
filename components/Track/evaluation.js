import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

const TakeTest = ({ route, navigation }) => {
  const { castIds } = route.params;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

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

  const handleAnswerSelection = (selectedAnswer) => {
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.correct;
    const isCorrect = selectedAnswer === correctAnswer;
    console.log("CORRECT ANSWER");

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      navigation.navigate('TrackScreen');
    }
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
            style={styles.answerButton}
            onPress={() => handleAnswerSelection(response)}
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
