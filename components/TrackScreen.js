import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ScrollView } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { Svg, Circle, Image as SvgImage } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

const TrackScreen = () => {
  const navigation = useNavigation();

  const handleReadyScreenPress = () => {
    navigation.navigate('ReadyScreen'); 
  };

  const fields = [
    { name: 'Aerodynamics', progress: 0.2, color: '#e74c3c' },
    { name: 'Robotics', progress: 0.5, color: '#3498db' },
    { name: 'Machine Learning', progress: 0.3, color: '#2ecc71' },
    { name: 'Artificial Intelligence', progress: 0.8, color: '#f39c12' },
  ];

  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    let animationFrameId;
    const startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - startTime;
      const divisor = 1000; // Adjust this value for slower/faster animation

      const progress = Math.min(deltaTime / divisor, 1);

      setAnimatedProgress(progress);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const castWatchGoal = 0.7; // Goal for Cast Watching Time
  const [castWatchProgress, setCastWatchProgress] = useState(0);

  useEffect(() => {
    let animationFrameId;
    const startTime = Date.now();

    const animateCastWatch = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - startTime;
      const divisor = 1000; // Adjust this value for slower/faster animation

      const progress = Math.min(deltaTime / divisor, 1);

      setCastWatchProgress(progress);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateCastWatch);
      }
    };

    animateCastWatch();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cast Watching Time */}
      <View style={styles.categoryContainer}>
        <View style={styles.categoryTitleContainer}>
          <Text style={styles.categoryTitle}>Cast Watching Time</Text>
        </View>
        <View style={styles.iconContainer}>
          <Svg width={60} height={60}>
            <Circle
              cx={30}
              cy={30}
              r={27}
              stroke="#ccc"
              strokeWidth={6}
              fill="none"
            />
            <Circle
              cx={30}
              cy={30}
              r={27}
              stroke="#3498db"
              strokeWidth={6}
              fill="none"
              strokeDasharray="162"
              strokeDashoffset={162 * (1 - Math.min(castWatchProgress, castWatchGoal))}
              strokeLinecap="round"
              transform="rotate(-90 30 30)"
            />
            <SvgImage
              x={12}
              y={12}
              width={36}
              height={36}
              href={require('../assets/Track_icons/clock.png')}
            />
          </Svg>
        </View>
      </View>
      {/* Demarcation */}
      <View style={styles.demarcation} />

      {/* Weekly Evaluation */}
      <View style={styles.categoryContainer}>
        <View style={styles.categoryTitleContainer}>
          <Text style={styles.categoryTitle}>Weekly Evaluation</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleReadyScreenPress}>
          <Text style={styles.buttonText}>Take the Test</Text>
        </TouchableOpacity>
      </View>

      {/* Demarcation */}
      <View style={styles.demarcation} />

      {/* Track Progress */}
      <View style={styles.categoryContainer}>
        <View style={styles.categoryTitleContainer}>
          <Text style={styles.categoryTitle}>Track Progress</Text>
        </View>
        {fields.map((field, index) => (
          <View key={index} style={styles.fieldContainer}>
            <Text style={styles.fieldName}>{field.name}</Text>
            <ProgressBar
              progress={field.progress}
              color={field.color}
              style={styles.progressBar}
              borderRadius={15}
              borderWidth={0}
              height={15}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f1f1f1',
    padding: 20,
  },
  categoryContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1c1c1c',
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconImage: {
    width: 50,
    height: 50,
  },
  valueText: {
    fontSize: 18,
    color: '#1c1c1c',
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  demarcation: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
  },
  fieldContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  fieldName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1c1c1c',
    marginBottom: 8,
  },
  progressBar: {
    width: windowWidth - 100, // Adjust for spacing
    height: 15,
    borderRadius: 15,
  },
});

export default TrackScreen;
