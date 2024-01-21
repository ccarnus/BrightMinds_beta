import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { spacing } from '../theme';

const CastTypeChoice = () => {
  const navigation = useNavigation();
  const [button1Visible, setButton1Visible] = useState(false);
  const [button2Visible, setButton2Visible] = useState(false);
  const [button3Visible, setButton3Visible] = useState(false);
  const fadeInDuration = 250;
  const buttonContainerHeight = 100;

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setButton1Visible(true);
    }, fadeInDuration);

    const timer2 = setTimeout(() => {
      setButton2Visible(true);
    }, fadeInDuration * 2);

    const timer3 = setTimeout(() => {
      setButton3Visible(true);
    }, fadeInDuration * 3);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleChoice = (castType) => {
    switch (castType) {
      case 'Podcast':
        break;
      case 'Clip':
        navigation.navigate('PostCast');
        break;
      case 'Article':
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.buttonContainer, { height: buttonContainerHeight }]}>
        {button1Visible && (
          <Animated.View
            style={[styles.button, { opacity: button1Visible ? 1 : 0 }]}
          >
            <TouchableOpacity onPress={() => handleChoice('Podcast')}>
              <View style={styles.content}>
                <Image
                  source={require('../../assets/Cast_screen_icons/podcast_logo.png')}
                  style={styles.icon}
                />
                <Text style={styles.buttonText}>Podcast</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>

      <View style={[styles.buttonContainer, { height: buttonContainerHeight }]}>
        {button2Visible && (
          <Animated.View
            style={[styles.button, { opacity: button2Visible ? 1 : 0 }]}
          >
            <TouchableOpacity onPress={() => handleChoice('Clip')}>
              <View style={styles.content}>
                <Image
                  source={require('../../assets/Cast_screen_icons/cast_logo.png')}
                  style={styles.icon}
                />
                <Text style={styles.buttonText}>Clip</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>

      <View style={[styles.buttonContainer, { height: buttonContainerHeight }]}>
        {button3Visible && (
          <Animated.View
            style={[styles.button, { opacity: button3Visible ? 1 : 0 }]}
          >
            <TouchableOpacity onPress={() => handleChoice('Article')}>
              <View style={styles.content}>
                <Image
                  source={require('../../assets/Cast_screen_icons/article_logo.png')}
                  style={styles.icon}
                />
                <Text style={styles.buttonText}>Article</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}
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
  buttonContainer: {
    width: '80%',
    marginBottom: 30,
    marginLeft:spacing.l
  },
  button: {
    opacity: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
  },
  icon: {
    width: 74,
    height: 70,
    marginRight: 20,
  },
  buttonText: {
    fontSize: 32,
    color: '#1c1c1c',
    fontWeight: 'bold',
  },
});

export default CastTypeChoice;
