import React, { useRef, useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Video } from 'expo-av';

const CatchUpScreen = () => {
  const video = useRef(null);
  const [status, setStatus] = useState({});

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        style={styles.video}
        source={{
          uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
        }}
        useNativeControls
        resizeMode="contain"
        isLooping
        onPlaybackStatusUpdate={status => setStatus(status)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  video: {
    alignSelf: 'center',
    width: 350,
    height: 220,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CatchUpScreen;
