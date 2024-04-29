import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { Video } from 'expo-av';
import { Dimensions } from 'react-native';
import axios from 'axios';
import {colors, shadow, sizes, spacing} from './theme';


const DiscoverScreen = ({ navigation }) => {
  const { width, height } = Dimensions.get('window');
  const [videos, setVideos] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [videoStatus, setVideoStatus] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkedCasts, setBookmarkedCasts] = useState([]);
  const videoRefs = useRef([]);
  const userId = "6474e4001eec5ee1ecd40180";
  const [videoVerifications, setVideoVerifications] = useState([]);
  const [videoDimensions, setVideoDimensions] = useState({ width: width, height: height / 2 });


  useEffect(() => {
    fetch('http://3.17.219.54/cast')
    .then(response => response.json())
    .then(data => {
      const fetchUniversityLogosAndApprovalStatus = data.map(cast => 
        Promise.all([
          fetch(`http://3.17.219.54/university/by/name/${cast.university}`)
            .then(res => res.json())
            .then(universityData => ({...cast, universityLogo: universityData.iconurl})),
          fetch(`http://3.17.219.54/cast/verification/${cast._id}`)
            .then(res => res.json())
            .then(verificationData => ({...cast, isApproved: verificationData.approvals >= 5}))
        ]).then(results => Object.assign({}, ...results))
      );
      return Promise.all(fetchUniversityLogosAndApprovalStatus);
    })
    .then(dataWithLogosAndApproval => {
      setVideos(dataWithLogosAndApproval);
      setVideoStatus(dataWithLogosAndApproval.map(() => false));
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
    setVideoStatus(videos.map((_, index) => index === focusedIndex));
  }, [videos, focusedIndex]);

  const handleVideoPress = () => {
    const currentStatus = !videoStatus[focusedIndex];
    setVideoStatus(videoStatus.map((status, idx) => idx === focusedIndex ? !status : status));
  };

  const handleNextVideoPress = () => {
    const nextIndex = (focusedIndex + 1) % videos.length;
    setFocusedIndex(nextIndex);
    setVideoStatus(videoStatus.map((_, idx) => idx === nextIndex));
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
      .post(`http://3.17.219.54/user/add/content/${userId}`, { contentId: castId, type: "cast" })
      .then(response => {
        setBookmarkedCasts([...bookmarkedCasts, { castId }]);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleVideoLoad = (metaData) => {
    if (metaData && metaData.naturalSize && metaData.naturalSize.width && metaData.naturalSize.height) {
      const { width: videoWidth, height: videoHeight } = metaData.naturalSize;
      const ratio = videoWidth / videoHeight;
      const maxHeight = height / 2;
      const maxWidth = width;
      let adjustedHeight = maxHeight;
      let adjustedWidth = adjustedHeight * ratio;
  
      if (adjustedWidth > maxWidth) {
        adjustedWidth = maxWidth;
        adjustedHeight = adjustedWidth / ratio;
      }
  
      setVideoDimensions({ width: adjustedWidth, height: adjustedHeight });
    } else {
      setVideoDimensions({ width: height * (9 / 32), height: height / 2 });
    }
  };
  
  
  useEffect(() => {
    const pauseVideo = () => {
      setVideoStatus(prevStatus => prevStatus.map(() => false));
    };
    const unsubscribe = navigation.addListener('blur', pauseVideo);
    return unsubscribe;
  }, [navigation]);
  
  return (
    <View style={styles.container}>
      {videos.length > 0 && (
        <TouchableOpacity
          style={[styles.videoContainer, { height: videoDimensions.height }]}
          onPress={handleVideoPress}
          activeOpacity={0.9}
        >
          <Video
            ref={ref => (videoRefs.current[focusedIndex] = ref)}
            source={{ uri: videos[focusedIndex].casturl }}
            shouldPlay={videoStatus[focusedIndex]}
            resizeMode="cover"
            style={{ width: videoDimensions.width, height: videoDimensions.height }}
            onLoad={handleVideoLoad}
            onPlaybackStatusUpdate={status => {
              if (status.didJustFinish) {
                videoRefs.current[focusedIndex].setPositionAsync(0);
              }
            }}
          />
        </TouchableOpacity>
      )}
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.button} onPress={handleNextVideoPress}>
          <Text style={styles.buttonText}>Find Next</Text>
        </TouchableOpacity>
        <Image
              source={{ uri: videos[focusedIndex].universityLogo }}
              style={styles.universityIcon}
              resizeMode="contain"
              />
      </View>
    </View>
  );
};


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkblue,
  },
  videoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    padding: 15,
    backgroundColor: colors.black,
    alignItems: 'center',
    borderRadius: sizes.radius,
    width:"80%",
    marginLeft: "10%",
    marginTop: spacing.m,
  },
  universityIcon: {
    width: "100%",
    height: "100%",
    marginHorizontal: 12,
  },
});

export default DiscoverScreen;