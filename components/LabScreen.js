import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PanGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Define base radius and increment
const baseRadius = 30; // Starting radius for the first circle
const radiusIncrement = 100; // Radius increment for each subsequent circle

const LabScreen = () => {
  const navigation = useNavigation();
  const [labs, setLabs] = useState([]);

  // Fetch labs data
  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const response = await fetch('http://3.17.219.54/virtual/lab');
        const data = await response.json();
        setLabs(data);
      } catch (error) {
        console.error('Error fetching lab data:', error);
      }
    };

    fetchLabs();
  }, []);

  // Shared values for pan and zoom
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  // Pan gesture handler
  const panGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
  });

  // Pinch (zoom) gesture handler
  const pinchGestureEvent = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      ctx.startScale = scale.value;
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;

      // Calculate the initial focal point relative to the screen center
      ctx.focalX = event.focalX - SCREEN_WIDTH / 2;
      ctx.focalY = event.focalY - SCREEN_HEIGHT / 2;
    },
    onActive: (event, ctx) => {
      // Update scale
      scale.value = event.scale * ctx.startScale;

      // Calculate zoom focus shift
      const focusX = event.focalX - SCREEN_WIDTH / 2;
      const focusY = event.focalY - SCREEN_HEIGHT / 2;

      // Adjust translate values based on the scale and focal point
      translateX.value = ctx.startX + (focusX - ctx.focalX) * (1 - scale.value);
      translateY.value = ctx.startY + (focusY - ctx.focalY) * (1 - scale.value);
    },
    onEnd: () => {
      // Additional logic to limit zoom or adjust end position can be added here
    },
  });

  

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  // Calculate lab position
  const calculatePosition = (index, totalLabs) => {
    // Determine which circle the lab is on based on its index and the desired number of labs per circle
    const circleIndex = Math.floor(Math.sqrt(index)); // Simplified formula for distributing labs across circles
    const radius = baseRadius + circleIndex * radiusIncrement;
    const labsOnThisCircle = circleIndex * 6 + 6; // Approximate formula for number of labs on the current circle, adjust based on your needs

    // Calculate angle and position for the lab on its circle
    const angle = (index % labsOnThisCircle) * (2 * Math.PI / labsOnThisCircle);
    const x = radius * Math.cos(angle) + SCREEN_WIDTH / 2;
    const y = radius * Math.sin(angle) + SCREEN_HEIGHT / 2;

    return { left: x, top: y };
  };


  const renderLab = (lab, index) => {
    const position = calculatePosition(index, labs.length);
    return (
      <TouchableOpacity
        key={lab._id}
        style={[styles.labContainer, { position: 'absolute', left: position.left, top: position.top }]}
        onPress={() => navigation.navigate('VirtualLab', { labId: lab._id })}
      >
        <Image source={{ uri: lab.iconurl }} style={styles.labImage} />
        <Text style={styles.labText}>{lab.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={panGestureEvent}>
        <Animated.View style={styles.wrapper}>
          <PinchGestureHandler onGestureEvent={pinchGestureEvent}>
            <Animated.View style={[styles.scrollView, animatedStyle]}>
              {labs.map(renderLab)}
            </Animated.View>
          </PinchGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    overflow: 'hidden',
  },
  scrollView: {
    // Ensure this view is large enough to contain the full spiral
    width: SCREEN_WIDTH * 3,
    height: SCREEN_HEIGHT * 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labContainer: {
    // Adjust size as needed
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labImage: {
    width: '60%',
    height: '60%',
  },
  labText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
export default LabScreen;
