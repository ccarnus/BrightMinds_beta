import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import axios from 'axios';
import Gauge from './Gauge';

const USER_ID = "6474e4001eec5ee1ecd40180";

const TakeTest = ({ route, navigation }) => {
  const { castIds } = route.params;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [displayedQuestion, setDisplayedQuestion] = useState('');
  const typingIntervalRef = useRef(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    const currentQuestion = questions[currentQuestionIndex]?.question;
    if (currentQuestion) {
      setDisplayedQuestion('');
      typeQuestion(currentQuestion);
    }
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, [currentQuestionIndex, questions]);

  const typeQuestion = (questionText) => {
    let i = 0;
    typingIntervalRef.current = setInterval(() => {
      setDisplayedQuestion((prev) => prev + questionText.charAt(i));
      i++;
      if (i > questionText.length) clearInterval(typingIntervalRef.current);
    }, 50); // Adjust the speed by changing the interval time
  };

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

  const removeCastFromEvaluationList = async (castId) => {
    try {
      await axios.post(`http://3.17.219.54/user/mark/cast/as/answered/${USER_ID}`, {
        castId: castId,
      });
      console.log(`Cast ${castId} marked as answered`);
    } catch (error) {
      console.error(`Error marking cast ${castId} as answered:`, error);
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
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.correct;
    const isAnswerCorrect = selectedResponse === correctAnswer;

    setSelectedAnswer(selectedResponse);
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      addPoints(10);
      removeCastFromEvaluationList(castIds[currentQuestionIndex]);
    }

    // Wait for 1 second and then move to the next question
    setTimeout(() => {
      setSelectedAnswer(null);
      setIsCorrect(null);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        navigation.navigate('Track');
      }
    }, 1000);
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      <Gauge total={questions.length} current={currentQuestionIndex} />
      <View style={styles.questionContainer}>
      <Text style={styles.questionText}>{displayedQuestion}</Text>
      </View>
      <ScrollView
        style={styles.answersContainer}
        contentContainerStyle={styles.answersContent}
      >
        {currentQuestion?.responses.map((response, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.answerButton,
              {
                backgroundColor:
                  selectedAnswer === response
                    ? isCorrect
                      ? '#4CAF50'
                      : '#F44336'
                    : '#FFFFFF',
              },
            ]}
            onPress={() => handleAnswerSelection(response)}
            disabled={selectedAnswer !== null}
          >
            <Text style={styles.answerButtonText}>{response}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    marginBottom: 20,
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  answersContainer: {
    flex: 1,
    width: '100%',
  },
  answersContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerButton: {
    padding: 15,
    marginBottom: 20,
    borderRadius: 25,
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerButtonText: {
    fontSize: 18,
    color: '#1c1c1c',
    fontWeight: 'bold',
  },
});

export default TakeTest;