import React, { useState, useEffect, useRef } from 'react';
import { Animated , View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import axios from 'axios';
import Gauge from './Gauge';
import { colors, sizes, spacing } from '../theme';

const USER_ID = "6474e4001eec5ee1ecd40180";
let correctAnswerCount = 0;

const TakeTest = ({ route, navigation }) => {
  const { evaluations } = route.params;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [displayedQuestion, setDisplayedQuestion] = useState('');
  const typingIntervalRef = useRef(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  
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
    }, 50);
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

  const removeContentFromEvaluationList = async (evaluation) => {
    try {
      await axios.post(`http://3.17.219.54/user/mark/content/as/answered/${USER_ID}`, {
        contentId: evaluation.contentid,
      });
      console.log(`Content ${evaluation.contentid} marked as answered`);
    } catch (error) {
      console.error(`Error marking content ${evaluation.contentid} as answered:`, error);
    }
  };
  
  const fetchQuestions = async () => {
    try {
      const questionsPromises = evaluations.map(item => {
        const url = item.type === 'article'
          ? `http://3.17.219.54/article/${item.contentid}`
          : `http://3.17.219.54/cast/${item.contentid}`;
        return axios.get(url);
      });
      const questionsResponses = await Promise.all(questionsPromises);
      const questionsData = questionsResponses.map(response => response.data.evaluation);
  
      setQuestions(questionsData);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };
  

  const animateCorrectAnswer = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.6,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  const animateIncorrectAnswer = () => {
    Animated.sequence([
      // Shaking to the left and right
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
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
      animateCorrectAnswer();
      addPoints(10);
      correctAnswerCount = correctAnswerCount + 1 ;
      console.log(`current count ${correctAnswerCount}`)
      removeContentFromEvaluationList(evaluations[currentQuestionIndex]);
    } else {
      animateIncorrectAnswer();
    }

    // Wait for 1 second and then move to the next question
    setTimeout(() => {
      setSelectedAnswer(null);
      setIsCorrect(null);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        console.log(`correct answers count ${correctAnswerCount}`)
        navigation.navigate('Finish', {
          totalQuestions: questions.length,
          correctAnswers: correctAnswerCount,
        });
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
          <Animated.View
          key={index}
          style={{
            transform: [
              { scale: selectedAnswer === response && isCorrect ? scaleAnim : 1 },
              { translateX: selectedAnswer === response && isCorrect === false ? shakeAnim : 0 }
            ],
          }}
        >
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
          </Animated.View>
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
    backgroundColor: colors.black,
    borderRadius: sizes.radius,
    marginTop:spacing.m,
    marginBottom: spacing.m,
    marginLeft: spacing.m,
    marginRight: spacing.m,
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.white,
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
    borderWidth: 1,
    borderColor: colors.black,
  },
  answerButtonText: {
    fontSize: 18,
    color: '#1c1c1c',
    fontWeight: 'bold',
  },
});

export default TakeTest;