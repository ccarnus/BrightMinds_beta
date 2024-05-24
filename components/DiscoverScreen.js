import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet, Modal } from 'react-native';
import { Video } from 'expo-av';
import { Dimensions } from 'react-native';
import axios from 'axios';
import { colors, sizes, spacing } from './theme';

const { width, height } = Dimensions.get('window');

const DiscoverScreen = ({ navigation }) => {
  const [videos, setVideos] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [videoStatus, setVideoStatus] = useState([]);
  const [showVideo, setShowVideo] = useState(false);
  const videoRefs = useRef([]);
  const userId = "6474e4001eec5ee1ecd40180";

  useEffect(() => {
    fetch('http://3.17.219.54/cast')
      .then(response => response.json())
      .then(data => {
        console.log('Data fetched:', data); // Log fetched data
        if (data && data.length > 0) {
          const fetchUniversityLogosAndApprovalStatus = data.map(cast =>
            Promise.all([
              fetch(`http://3.17.219.54/university/by/name/${cast.university}`)
                .then(res => res.json())
                .then(universityData => ({ ...cast, universityLogo: universityData.iconurl })),
              fetch(`http://3.17.219.54/cast/verification/${cast._id}`)
                .then(res => res.json())
                .then(verificationData => ({ ...cast, isApproved: verificationData.approvals >= 5 }))
            ]).then(results => Object.assign({}, ...results))
          );
          return Promise.all(fetchUniversityLogosAndApprovalStatus);
        }
        return [];
      })
      .then(dataWithLogosAndApproval => {
        setVideos(dataWithLogosAndApproval);
        setVideoStatus(dataWithLogosAndApproval.map(() => false));
      })
      .catch(error => {
        console.error('Fetching error:', error);
      });
  }, []);

  const handleCastDonePlaying = () => {
    const castId = videos[focusedIndex]._id;

    axios
      .post(`http://3.17.219.54/user/add/content/${userId}`, { contentId: castId, type: "cast" })
      .catch(error => {
        console.error(error);
      });
  };

  const togglePlay = () => {
    setShowVideo(true);
    setVideoStatus(videoStatus.map((status, idx) => idx === focusedIndex ? !status : status));
  };

  const togglePlayVideoFocused = async () => {
    if (videoRefs.current[focusedIndex]) {
      const status = await videoRefs.current[focusedIndex].getStatusAsync();
      if (status.isPlaying) {
        await videoRefs.current[focusedIndex].pauseAsync();
      } else {
        await videoRefs.current[focusedIndex].playAsync();
      }
    }
  };

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration);
    const seconds = Math.round((duration - minutes) * 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };  

  const handleNextVideoPress = () => {
    const nextIndex = (focusedIndex + 1) % videos.length;
    setFocusedIndex(nextIndex);
    setVideoStatus(videoStatus.map((_, idx) => idx === nextIndex ? false : false));
  };

  return (
    <View style={styles.container}>
      {videos.length > 0 && videos[focusedIndex] && (
        <>
          <TouchableOpacity
            style={[styles.imageContainer, { height: width / 1.5 }]}
            onPress={togglePlay}
            activeOpacity={1}
          >
            <Image
              source={{ uri: videos[focusedIndex].castimageurl }}
              style={{ width: width, height: width /1.5 }}
              resizeMode="cover"
            />
            {!videoStatus[focusedIndex] && (
              <View style={styles.playIconContainer}>
                <Image
                  source={require('../assets/Cast_icons/play_icon.png')}
                  style={styles.playIcon}
                />
              </View>
            )}
            {videos[focusedIndex].isApproved && (
                <Image
                  source={require('../assets/Cast_icons/approved_badge.png')}
                  style={styles.approvedIcon}
                  resizeMode="contain"
                />
              )}
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={false}
            visible={showVideo}
            onRequestClose={() => {
              setShowVideo(false);
              setVideoStatus(videoStatus.map((status, idx) => idx === focusedIndex ? false : status));
            }}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={{ flex: 1 }}
              onPress={togglePlayVideoFocused}
            >
              <View style={{ flex: 1, backgroundColor: colors.secondary }}>
                <Video
                  ref={ref => (videoRefs.current[focusedIndex] = ref)}
                  source={{ uri: videos[focusedIndex].casturl }}
                  shouldPlay={videoStatus[focusedIndex]}
                  resizeMode="contain" // Ensure video maintains aspect ratio
                  style={{ width: '100%', height: '100%' }}
                  onPlaybackStatusUpdate={(status) => {
                    if (status.didJustFinish) {
                      handleCastDonePlaying();
                    }
                  }}
                />
              </View>
            </TouchableOpacity>
          </Modal>
        </>
      )}
      <View style={styles.bottomSection}>
        <View style={styles.band}>
          <Text style={styles.videoTitle}>{videos[focusedIndex] ? videos[focusedIndex].title : ''}</Text>
        </View>
        <View style={styles.middleband}>
          <View style={styles.leftColumn}>
            {videos[focusedIndex] && videos[focusedIndex].universityLogo && (
              <Image
                source={{ uri: videos[focusedIndex].universityLogo }}
                style={styles.universityIcon}
                resizeMode="contain"
              />
            )}
          </View>
          <View style={styles.rightColumn}>
            <Text style={styles.durationText}>
              {videos[focusedIndex] ? formatDuration(videos[focusedIndex].duration) : '00:00'}
            </Text>
          </View>
        </View>
        <View style={styles.band}>
          <TouchableOpacity style={styles.button} onPress={handleNextVideoPress}>
            <Text style={styles.buttonText}>Find Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBis,
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  band: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  middleband: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  leftColumn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightColumn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  universityIcon: {
    width: 54,
    height: 54,
  },
  durationText: {
    fontSize: sizes.h3,
    color: colors.secondary,
    fontFamily: 'Montserrat',
  },
  button: {
    padding: 15,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    borderRadius: sizes.radius,
    width: "80%",
    elevation: 5,
  },
  buttonText: {
    fontSize: sizes.h3,
    color: colors.primaryBis,
    fontFamily: 'MontserratBold',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    width: width,
    height: width / 1.5,
  },
  approvedIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 50,
    height: 50,
  },
  playIconContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  playIcon: {
    width: 54,
    height: 54,
  },
  videoTitle: {
    fontSize: sizes.h2,
    color: colors.secondary,
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },
});

export default DiscoverScreen;
