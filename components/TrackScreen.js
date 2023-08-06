import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { ProgressBar } from 'react-native-paper';

const TrackScreen = () => {
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
      const divisor = 8000; // Adjust this value for slower/faster animation

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

  return (
    <View style={styles.container}>
      {fields.map((field, index) => (
        <View key={index} style={styles.fieldContainer}>
          <Text style={styles.fieldName}>{field.name}</Text>
          <ProgressBar
            progress={field.progress}
            color={field.color}
            style={styles.progressBar}
            borderRadius={10}
            borderWidth={0}
            height={20}
          />
        </View>
      ))}
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1c1c1c',
    marginBottom: 20,
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
  },
});

export default TrackScreen;
