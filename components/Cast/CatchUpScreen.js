import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
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
            <Text style={styles.title}>{video.title}</Text>
            <View style={styles.banner}>
              <Image source={require('../../assets/Cast_icons/bookmark_icon.png')} style={styles.icon} />
              <Image source={require('../../assets/Cast_icons/comment_icon.png')} style={styles.icon} />
              <Image source={require('../../assets/Cast_icons/share_icon.png')} style={styles.icon} />
            </View>
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
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    position: 'absolute',
    top: 30,
    width: '100%',
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  banner: {
    position: 'absolute',
    bottom: 150, // Adjust the distance from the bottom
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Add a background color to the banner
    paddingVertical: 10,
  },
});

export default CatchUpScreen;
