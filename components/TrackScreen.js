import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ScrollView } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { Svg, Circle, Image as SvgImage } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

const TrackScreen = () => {
  const navigation = useNavigation();

  const handleReadyScreenPress = () => {
    navigation.navigate('Ready'); 
  };

  const fields = [
    { name: 'Robotics', image: require('../assets/Cast_screen_icons/Robotics.png'), color: '#FF8C00', progress: 0.2 },
    { name: 'AI', image: require('../assets/Cast_screen_icons/AI.png'), color: '#228B22', progress: 0.5 },
    { name: 'Medicine', image: require('../assets/Cast_screen_icons/Medicine.png'), color: '#4682B4', progress: 0.27 },
    { name: 'Economics', image: require('../assets/Cast_screen_icons/Economic.png'), color: '#8A2BE2', progress: 0.78 },
    { name: 'Electronics', image: require('../assets/Cast_screen_icons/Electronics.png'), color: '#DC143C', progress: 0.24 },
    { name: 'Computer Science', image: require('../assets/Cast_screen_icons/Computer_science.png'), color: '#20B2AA', progress: 0 },
    { name: 'Aerospace', image: require('../assets/Cast_screen_icons/Aerospace.png'), color: '#556B2F', progress: 0.05 },
    { name: 'Biology', image: require('../assets/Cast_screen_icons/Biology.png'), color: '#800000', progress: 0.8 },
    { name: 'Chemistry', image: require('../assets/Cast_screen_icons/Chemistry.png'), color: '#2F4F4F', progress: 0.1 },
    { name: 'Physics', image: require('../assets/Cast_screen_icons/Physics.png'), color: '#4B0082', progress: 0.5 },
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
              stroke="#1c1c1c"
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
        <Text style={styles.WatchTimeText}>05:56:24 (6hr limit)</Text>
      </View>
      {/* Demarcation */}
      <View style={styles.demarcation} />

      {/* Weekly Evaluation */}
      <View style={styles.categoryContainer}>
        <TouchableOpacity style={styles.button} onPress={handleReadyScreenPress}>
          <Text style={styles.buttonText}>Start Weekly Evaluation</Text>
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
            <View style={styles.fieldContent}>
              <Image source={field.image} style={styles.fieldImage} />
              <ProgressBar
                progress={field.progress}
                color={field.color}
                style={styles.progressBar}
                borderRadius={15}
                borderWidth={0}
                height={15}
              />
            </View>
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
    width: 100,
    height: 100,
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
    backgroundColor: '#1c1c1c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#f1f1f1',
    fontSize: 24,
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
    marginTop: 20,
  },
  fieldContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  progressBar: {
    width: windowWidth - 100,
    height: 15,
    borderRadius: 15,
  },
  WatchTimeText: {
    color: '#1c1c1c',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TrackScreen;
