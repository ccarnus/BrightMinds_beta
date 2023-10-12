import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { Video } from 'expo-av';
import { Dimensions } from 'react-native';
import axios from 'axios';
import {colors, shadow, sizes, spacing} from './theme';

const WatchScreen = ({ navigation }) => {
  const [videos, setVideos] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [videoStatus, setVideoStatus] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkedCasts, setBookmarkedCasts] = useState([]);
  const videoRefs = useRef([]);
  const userId = "6474e4001eec5ee1ecd40180";

  useEffect(() => {
    fetch('http://3.17.219.54/cast')
      .then(response => response.json())
      .then(data => setVideos(data))
      .catch(error => console.error(error));

    axios
      .get(`http://3.17.219.54/user/bookmarks/${userId}`)
      .then(response => {
        setBookmarkedCasts(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);


  useEffect(() => {
    setVideoStatus(videos.map((_, index) => index === 0));
  }, [videos]);

  const handleVideoPress = index => {
    setFocusedIndex(index);
    setVideoStatus(prevStatus => prevStatus.map((status, idx) => (idx === index ? !status : false)));
  };

  const handleBookmarkPress = () => {
    const castId = videos[focusedIndex]._id;

    if (bookmarkedCasts.some(cast => cast.castId === castId)) {
      axios
        .delete(`http://3.17.219.54/user/remove/bookmarks/${userId}/${castId}`)
        .then(response => {
          setBookmarkedCasts(bookmarkedCasts.filter(cast => cast.castId !== castId));
          videos[focusedIndex].bookmarkIcon = require('../assets/Cast_icons/bookmark_icon.png');
        })
        .catch(error => {
          console.error(error);
        });
      return;
    }

    setIsBookmarked(true);

    videos[focusedIndex].bookmarkIcon = require('../assets/Cast_icons/bookmark_filled_icon.png');

    axios
      .post(`http://3.17.219.54/user/add/bookmarks/${userId}`, { castId: castId })
      .then(response => {
        setBookmarkedCasts([...bookmarkedCasts, { castId }]);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleCastDonePlaying = () => {
    const castId = videos[focusedIndex]._id;

    axios
      .post(`http://3.17.219.54/user/add/cast/${userId}`, { castId: castId })
      .then(response => {
        setBookmarkedCasts([...bookmarkedCasts, { castId }]);
      })
      .catch(error => {
        console.error(error);
      });
  };
  

  useEffect(() => {
    // Pause the video when the screen loses focus
    const pauseVideo = () => {
      setVideoStatus(prevStatus => prevStatus.map(() => false));
    };
    const unsubscribe = navigation.addListener('blur', pauseVideo);
    return unsubscribe;
  }, [navigation]);

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
          setVideoStatus(prevStatus =>
            prevStatus.map((status, idx) => (idx === index ? !status : false))
          );
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
            <View style={styles.videoWrapper}>
            <Video
              ref={ref => (videoRefs.current[index] = ref)}
              source={{ uri: video.casturl }}
              shouldPlay={videoStatus[index]}
              resizeMode="cover"
              style={styles.video}
              onPlaybackStatusUpdate={(status) => {
                if (status.didJustFinish) {
                  videoRefs.current[index].setPositionAsync(0);
                  handleCastDonePlaying();
                }
              }}
            />
            </View>
            <Text style={styles.title}>{video.title}</Text>
            <View style={styles.banner}>
            <TouchableOpacity style={styles.button} onPress={handleBookmarkPress}>
                <Image
                  source={
                    bookmarkedCasts.some(cast => cast.castId === video._id)
                      ? require('../assets/Cast_icons/bookmark_filled_icon.png')
                      : require('../assets/Cast_icons/bookmark_icon.png')
                  }
                  style={styles.icon}
                />
            </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Image
              source={require('../assets/Cast_icons/comment_icon.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Image
              source={require('../assets/Cast_icons/share_icon.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
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
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  videoContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  videoWrapper: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  title: {
    fontSize: sizes.title,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    position: 'absolute',
    top: 50,
    width: '100%',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  banner: {
    position: 'absolute',
    bottom: 120,
    left: 25,
    right: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(211, 211, 211, 0.7)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 18,
  },
  icon: {
    width: 32,
    height: 32,
    tintColor: colors.black,
    marginHorizontal: 12,
  },
});

export default WatchScreen;