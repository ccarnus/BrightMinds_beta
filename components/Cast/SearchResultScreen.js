import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { Video } from 'expo-av';
import { Dimensions } from 'react-native';
import axios from 'axios';
import { colors, sizes } from '../theme';

const { width, height } = Dimensions.get('window');

const SearchResultScreen = ({ route, navigation }) => {
  const { selectedCastId } = route.params;
  const [videos, setVideos] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [videoStatus, setVideoStatus] = useState([]);
  const [bookmarkedCasts, setBookmarkedCasts] = useState([]);
  const videoRefs = useRef([]);
  const userId = "6474e4001eec5ee1ecd40180";

  useEffect(() => {
    fetch(`http://3.17.219.54/cast/trending/right/now`)
      .then(response => response.json())
      .then(data => {
        const fetchUniversityLogos = data.map(video =>
          fetch(`http://3.17.219.54/university/by/name/${video.university}`)
            .then(res => res.json())
            .then(universityData => ({ ...video, universityLogo: universityData.iconurl }))
        );
        return Promise.all(fetchUniversityLogos);
      })
      .then(dataWithLogos => {
        const selectedIndex = dataWithLogos.findIndex(video => video._id === selectedCastId);
        setFocusedIndex(selectedIndex);
        setVideos([dataWithLogos[selectedIndex], ...dataWithLogos.slice(0, selectedIndex), ...dataWithLogos.slice(selectedIndex + 1)]);
      })
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
          videos[focusedIndex].bookmarkIcon = require('../../assets/Cast_icons/bookmark_icon.png');
        })
        .catch(error => {
          console.error(error);
        });
      return;
    }

    setIsBookmarked(true);

    videos[focusedIndex].bookmarkIcon = require('../../assets/Cast_icons/bookmark_filled_icon.png');

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
      .post(`http://3.17.219.54/user/add/cast/${userId}`, { cast_id: castId })
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
            <View style={styles.buttonUniversityContainer}>
              <Image
                source={{ uri: video.universityLogo }}
                style={styles.universityIcon}
                resizeMode="contain"
              />
            </View>
            <View style={styles.buttonBookmarkContainer}>
              <TouchableOpacity style={styles.button} onPress={handleBookmarkPress}>
                  <Image
                    source={
                      bookmarkedCasts.some(cast => cast.castId === video._id)
                        ? require('../../assets/Cast_icons/bookmark_filled_icon.png')
                        : require('../../assets/Cast_icons/bookmark_icon.png')
                    }
                    style={styles.icon}
                  />
              </TouchableOpacity>
            </View>
            <View style={styles.buttonCommentContainer}>
              <TouchableOpacity style={styles.button}>
                <Image
                  source={require('../../assets/Cast_icons/comment_icon.png')}
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View> 
            <View style={styles.buttonShareContainer}>
              <TouchableOpacity style={styles.button}>
                <Image
                  source={require('../../assets/Cast_icons/share_icon.png')}
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
  icon: {
    width: 32,
    height: 32,
    tintColor: colors.lightblue,
    marginHorizontal: 12,
  },
  universityIcon: {
    width: "100%",
    height: "100%",
    marginHorizontal: 12,
  },
  buttonBookmarkContainer: {
    position: 'absolute',
    top: height*0.5,
    right: 15,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.darkblue,
    backgroundColor: 'rgba(0, 64, 122, 0.5)',
  },
  buttonCommentContainer: {
    position: 'absolute',
    top: height*0.6,
    right: 15,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.darkblue,
    backgroundColor: 'rgba(0, 64, 122, 0.5)',
  },
  buttonShareContainer: {
    position: 'absolute',
    top: height*0.7,
    right: 15,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.darkblue,
    backgroundColor: 'rgba(0, 64, 122, 0.5)',
  },
  buttonUniversityContainer: {
    width: 64,
    height: 64,
    position: 'absolute',
    top: height*0.4,
    right: 15,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 50,
  },
  
});

export default SearchResultScreen;