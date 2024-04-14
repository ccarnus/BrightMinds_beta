import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, sizes, spacing } from '../theme';

const Finish = ({ route, navigation }) => {
  const { totalQuestions, correctAnswers } = route.params;
  const successRate = ((correctAnswers / totalQuestions) * 100).toFixed(0);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
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
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shakeAnim]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Evaluation Complete!</Text>

      <Animated.View style={{ transform: [{ rotate: shakeAnim.interpolate({
        inputRange: [-10, 10],
        outputRange: ['-10deg', '10deg'] // Rotate between -10 and 10 degrees
      }) }] }}>
        <Image
          source={require('../../assets/Track_icons/trophy_icon.png')}
          style={styles.icon}
        />
      </Animated.View>

      <Text style={styles.resultRate}>{successRate}%</Text>
      <Text style={styles.infoText}>The next test available in 11 hours</Text>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Track')}
      >
        <Text style={styles.buttonText}>Got it!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  title: {
    fontSize: sizes.title,
    fontFamily: 'MontserratBold',
    color: colors.black,
    marginBottom: spacing.l*2,
    marginLeft: spacing.m,
    marginRight: spacing.m,
  },
  icon: {
    width: 150,
    height: 150,
    marginBottom: spacing.l,
  },
  resultRate: {
    fontSize: sizes.title,
    color: colors.green,
    fontFamily: 'Montserrat',
    marginBottom: spacing.s,
  },
  infoText: {
    fontSize: sizes.h3,
    color: colors.gray,
    marginBottom: spacing.m,
    fontFamily: 'Montserrat',
  },
  button: {
    marginTop: spacing.l,
    padding: spacing.m,
    backgroundColor: colors.black,
    borderRadius: sizes.radius,
  },
  buttonText: {
    fontSize: sizes.h2,
    color: colors.white,
    fontWeight: 'bold',
  },
});

export default Finish;
