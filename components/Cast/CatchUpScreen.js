import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import { Dimensions } from 'react-native';

const CatchUpScreen = () => {
  const [videos, setVideos] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    // Fetch data from the endpoint
    fetch('http://3.17.219.54/cast')
      .then(response => response.json())
      .then(data => setVideos(data))
      .catch(error => console.error(error));
  }, []);

  const handleVideoPress = index => {
    setFocusedIndex(index);
    setIsPlaying(!isPlaying);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={event => {
          const offsetX = event.nativeEvent.contentOffset.x;
          const index = Math.round(offsetX / windowWidth);
          setFocusedIndex(index);
          setIsPlaying(true);
        }}
      >
        {videos.map((video, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.videoContainer,
              {
                width: windowWidth,
                height: windowHeight,
                opacity: focusedIndex === index ? 1 : 0.7,
              },
            ]}
            onPress={() => handleVideoPress(index)}
          >
            <Video
              source={{ uri: video.casturl }}
              shouldPlay={focusedIndex === index && isPlaying}
              resizeMode="cover"
              style={styles.video}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  videoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});

export default CatchUpScreen;
