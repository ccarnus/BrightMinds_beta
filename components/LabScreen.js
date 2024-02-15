import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PanGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const hexSize = 110; // Assume each hexagon's side length is 50 units
const hexHeight = Math.sqrt(3) * hexSize; // Vertical distance between hexagon centers
const hexWidth = 2 * hexSize; // Horizontal distance between hexagon centers

const MAX_SCALE = 4; // Maximum zoom level
const MIN_SCALE = 1; // Minimum zoom level (normal size)

const CONTENT_WIDTH = SCREEN_WIDTH * 2; // Adjust based on your content size
const CONTENT_HEIGHT = SCREEN_HEIGHT * 1.5; // Adjust based on your content size


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
      // Calculate proposed translation
      const proposedTranslateX = ctx.startX + event.translationX;
      const proposedTranslateY = ctx.startY + event.translationY;
    
      // Apply limits to prevent moving content out of view
      translateX.value = Math.min(Math.max(proposedTranslateX, -CONTENT_WIDTH + SCREEN_WIDTH), 0);
      translateY.value = Math.min(Math.max(proposedTranslateY, -CONTENT_HEIGHT + SCREEN_HEIGHT), 0);
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
      const newScale = event.scale * ctx.startScale;
      scale.value = Math.max(MIN_SCALE, Math.min(newScale, MAX_SCALE));
    
      // Adjust translate values to keep the zoom centered on the pinch
      // This might require recalculating translateX and translateY based on the new scale
      // to ensure the content remains centered and within bounds
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

  const calculatePosition = (index) => {
    // Calculate row and column for hex grid (0-indexed)
    const row = Math.floor(index / 3); // Example row calculation, adjust based on your grid
    const col = index % 3; // Example column calculation, adjust as necessary
  
    // For a flat-topped hexagon grid
    const x = col * hexWidth + (row % 2) * hexWidth / 2;
    const y = row * hexHeight * 0.75; // 0.75 accounts for the overlap in hexagon height
  
    return { left: x + (SCREEN_WIDTH - hexWidth) / 2, top: y + (SCREEN_HEIGHT - hexHeight) / 2 };
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
    width: '100%',
    height: '100%',
  },
  labText: {
    fontSize: 12,
    textAlign: 'center',
    width:100
  },
});
export default LabScreen;
